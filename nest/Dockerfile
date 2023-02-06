# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tor <tor@student.42.fr>                    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/11/09 14:36:04 by lothieve          #+#    #+#              #
#    Updated: 2023/02/05 20:39:18 by tor              ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:19

WORKDIR /usr/app/
COPY ./backend/package*.json ./
COPY ./backend/tsconfig.json .
RUN npm install -g \
    @nestjs/cli \
    typeorm-cli
CMD npm install; npm run build; npm run start:debug
