# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tor <tor@student.42.fr>                    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/11/09 14:36:04 by lothieve          #+#    #+#              #
#    Updated: 2023/03/14 11:19:26 by tor              ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:19

RUN mkdir /profilepics
WORKDIR /usr/app/
CMD npm install; npm run build; npm run start:debug
