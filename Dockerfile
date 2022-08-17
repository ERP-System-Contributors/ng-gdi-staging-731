#
# Erp System - Mark II No 26 (Baruch Series) Client v 0.1.2-SNAPSHOT
# Copyright © 2021 - 2022 Edwin Njeru (mailnjeru@gmail.com)
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#

# This is a simple build. Our aspirations had been to come up with a container
# that had environment variables that could be varied at runtime to change the
# reference to the backend server, but all those efforts were met with failure.
# We intend to get back to that but at the moment what we have is a hard-coded
# reference to the backend API on the default.conf file copied directly to the
# conf.d.
# We retain the custom enrty-point for future development
# Stage 1
FROM node:14.19-alpine AS compile-image

WORKDIR /opt/app
# Enable the line below for in-container npm configurations
COPY .npmrc /opt/app
COPY package.json /opt/app
COPY package-lock.json /opt/app

COPY . /opt/app
RUN npm install --silent

ENV PATH="./node_modules/.bin:$PATH"

RUN npm run webapp:build:prod

# Stage 2
FROM nginx
COPY src/main/docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=compile-image /opt/app/target/classes/static /usr/share/nginx/html

COPY src/main/docker/docker-defaults.sh /
# Just in case the file mode was not properly set in Git
RUN chmod +x /docker-defaults.sh

# This will delegate to the original Nginx `docker-entrypoint.sh`
ENTRYPOINT ["/docker-defaults.sh"]

# The default parameters to ENTRYPOINT (unless overruled on the command line)
CMD ["nginx", "-g", "daemon off;"]
