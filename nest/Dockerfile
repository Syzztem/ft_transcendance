# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tor <tor@student.42.fr>                    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/11/09 14:36:04 by lothieve          #+#    #+#              #
#    Updated: 2023/03/13 20:23:08 by tor              ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:19

RUN mkdir /profilepics
WORKDIR /usr/app/
CMD npm install; npm run build; npm run start:debug
