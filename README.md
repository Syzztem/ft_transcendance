# ft_transcendance 

## API

### User

`GET`  `id(GetUserDTO)`  
Retourne l'utilisateur pointe par `GetUserDTO.id` ainsi que tous les membres demandes.

`POST` `new(CreateUserDTO)`  
Cree un utilisateur a partir des informations de base entres par ce dernier

`POST` `dm(SendDmDTO)`  
Envoie un message prive de la part de SendDmDTO.id1 a SendDMDTO.id2

`PATCH` `friend/<ID1>/<ID2>`  
Cree un lien d'amitie de l'utilisateur ID1 a l'utilisateur ID2

`PATCH` `unfriend/<ID1>/<ID2>`  
Supprime le lien d'amitie entre l'utilisateur ID1 et l'utilisateur ID2

`PATCH` `block/<ID1>/<ID2>`  
Bloque l'utilisateur ID2 aux yeux de l'utilisateur ID1

`PATCH` `unblock/<ID1>/<ID2>`  
Debloque l'utilisateur ID2aux yeux de l'utilisateur ID1

`DELETE` `dm/<ID>`  
Supprime le message prive pointe par ID

`DELETE` `<ID>`  
Supprime l'utilisateur pointe par ID

### Channel

`GET` `id(GetChannelDTO)`  
Retourne le channel pointe par `GetChannelDTO.id` ainsi que tous les membres demandes.

`GET` `page(GetMessageDTO)`  
Retourne la page de 50 messages `GetMessageDTO.page` appartenant au channel `GetChannelDTO.channel`

`POST` `new(CreateChannelDTO)`  
Cree un nouveau channel

`POST` `newmsg(PostMessageDTO)`  
Ajoute un message sur le channel `PostMessageDTO.channel`

`DELETE` `<msg/<ID>`  
Supprime le message pointe par ID

`DELETE` `<ID>`  
Supprime le channel pointe par ID

