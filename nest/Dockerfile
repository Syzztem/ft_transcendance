# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: lothieve <marvin@42.fr>                    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/11/09 14:36:04 by lothieve          #+#    #+#              #
#    Updated: 2022/11/09 15:23:22 by lothieve         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:19

WORKDIR /
COPY ./backend .
RUN npm install; npm run build
CMD npm run start
