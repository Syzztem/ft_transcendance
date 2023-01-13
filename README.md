# ft_transcendance 

## API

### User

`GET`  `id(GetUserDTO)`  
Retourne l'utilisateur pointe par `GetUserDTO.id` ainsi que tous les membres demandes.

`POST` `new(CreateUserDTO)`  
Cree un utilisateur a partir des informations de base entres par ce dernier

### Channel

`GET` `id(GetChannelDTO)`  
Retourne le channel pointe par `GetChannelDTO.id` ainsi que tous les membres demandes.

`GET` `page(GetMessageDTO)`  
Retourne la page de 50 messages `GetMessageDTO.page` appartenant au channel `GetChannelDTO.channel`

`POST` `new(CreateChannelDTO)`  
Cree un nouveau channel

`POST` `newmsg(PostMessageDTO)`  
Ajoute un message sur le channel `PostMessageDTO.channel`
