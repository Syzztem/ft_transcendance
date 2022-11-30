# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tor <tor@student.42.fr>                    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/11/09 14:36:04 by lothieve          #+#    #+#              #
#    Updated: 2022/11/30 18:24:05 by tor              ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:19

RUN mkdir back
WORKDIR /back
COPY ./backend/package.json .
COPY ./backend/tsconfig.json .
RUN npm install -g \
    @nestjs/cli \
    typeorm-cli
RUN npm install; npm run build
CMD npm run start:dev

