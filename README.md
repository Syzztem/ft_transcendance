# ft_transcendance 

## API

### User
___

`GET`  `id(GetUserDTO)`  
Retourne l'utilisateur pointe par `GetUserDTO.id` ainsi que tous les membres demandes.
#### http codes:  
`OK` : Succes  
`NOT_FOUND` : Utilisateur inexistant
___
  
`POST` `new(CreateUserDTO)`  
Cree un utilisateur a partir des informations de base entrees par ce dernier
#### http codes:  
`OK` : Succes  
`CONFLICT` : Un utilisateur existe deja avec ce nom  
___

`POST` `dm(SendDmDTO)`  
Envoie un message prive de la part de SendDmDTO.id1 a SendDMDTO.id2
#### http codes:  
`OK` : Succes  
`NOT_FOUND`: Un des utilisateurs n'existe pas  
`FORBIDDEN`: Un des deux utilisateurs a bloque l'autre
___

`PATCH` `friend/<ID1>/<ID2>`  
Cree un lien d'amitie de l'utilisateur ID1 a l'utilisateur ID2
#### http codes:
`OK` Succes  
`NOT_FOUND` : Un des utilisateurs n'existe pas  
`FORBIDDEN` : Un des deux utilisateurs a bloque l'autre  
`NO_CONTENT` : Les utilisateurs sont deja amis  
___

`PATCH` `unfriend/<ID1>/<ID2>`  
Supprime le lien d'amitie entre l'utilisateur ID1 et l'utilisateur ID2
#### http codes:
`OK` : Succes  
`NOT_FOUND`: Un des utilisateurs n'existe pas  
`NO_CONTENT`: Les utilisateurs ne sont pas amis  
___

`PATCH` `block/<ID1>/<ID2>`  
Bloque l'utilisateur ID2 aux yeux de l'utilisateur ID1
#### http codes:
`OK` : Succes  
`NOT_FOUND` : Un des utilisateurs n'existe pas  
`NO_CONTENT` : L'utilisateur est deja bloque  
___

`PATCH` `unblock/<ID1>/<ID2>`  
Debloque l'utilisateur ID2 aux yeux de l'utilisateur ID1
#### http codes:
`OK` : Succes  
`NOT_FOUND` : Un des utilisateurs n'existe pas  
`NO_CONTENT` : L'utilisateur n'est pas bloque
___

`DELETE` `dm/<ID>`  
Supprime le message prive pointe par ID
#### http codes:
`NO_CONTENT` : Succes  
`NOT_FOUND` : Le message n'existe pas  
___

`DELETE` `<ID>`  
Supprime l'utilisateur pointe par ID
#### http codes:
`NO_CONTENT` : Succes  
`NOT_FOUND` : L'utilisateur n'existe pas  
___

### Channel
___

`GET` `id(GetChannelDTO)`  
Retourne le channel pointe par `GetChannelDTO.id` ainsi que tous les membres demandes.
#### http codes:
`OK` : Succes  
`NOT_FOUND` : Le channel n'existe pas  
___

`GET` `page(GetMessageDTO)`  
Retourne la page de 50 messages `GetMessageDTO.page` appartenant au channel `GetChannelDTO.channel`
#### http codes:
`OK` : Succes  
`NOT_FOUND` : La page et/ou le channel n'existent pas  
___

`POST` `new(CreateChannelDTO)`  
Cree un nouveau channel
#### http codes:
`OK` : Succes  
___

`POST` `newmsg(PostMessageDTO)`  
Ajoute un message sur le channel `PostMessageDTO.channel`
#### http codes:
`OK` : Succes  
`NOT_FOUND` : Le channel n'existe pas  
`FORBIDDEN` : L'utilisateur ne fait pas partie du channel ou est muet sur ce channel  
___

`PATCH` `ban/<chanId>/<uid>/<date>`  
Bannit l'utilisateur pointe par `uid` du channel pointe par `chanId` jusqu'a `date`
#### http codes:
`OK` : Succes  
`NOT_FOUND` : L'utilisateur et/ou le channel n'existent pas ou l'utilisateur ne fait pas partie du channel  
___

`PATCH` `mute/<chanId>/<uid>/<date>`  
Rend muet l'utilisateur pointe par `uid` sur le channel pointe par `chanId` jusqu'a `date`
#### http codes:
`OK` : Succes  
`NOT_FOUND` : L'utilisateur et/ou le channel n'existent pas ou l'utilisateur ne fait pas partie du channel  
`NO_CONTENT` : L'utilisateur est deja muet  
___

`PATCH` `unban/<chanId>/<uid>`  
Revoque le banissement ou la mise en sourdine de l'utilisateur pointe par `uid` sur le channel pointe par `chanId`
#### http codes:
`OK` Succes  
`NOT_FOUND` L'utilisateur n'est ni bani ni muet sur le channel ou n'existe pas et/ou le channel n'existe pas  
___

`PATCH` `join/<chanId>/<uid>`   
L'utilisateur pointe par `uid` rejoint le channel pointe par `chanId`
#### http codes:
`OK` : Succes  
`FORBIDDEN` : L'utilisateur est banni du Channel  
`NOT_FOUND` : L'utilisateur et/ou le channel n'existent pas  
___

`PATCH` `leave/<chanId>/<uid>`  
L'utilisateur pointe par `uid` quitte le channel pointe par `chanId`
#### http codes:
`OK`: Succes  
`NOT_FOUND` : L'utilisateur et/ou le channel n'existent pas, ou l'utilisateur n'est pas present sur le channel  
___

`DELETE` `<msg/<ID>`  
Supprime le message pointe par ID
#### http codes:
`NO_CONTENT` : Succes  
`NOT_FOUND` : Le message n'existe pas  
___


`DELETE` `<ID>`  
Supprime le channel pointe par ID
#### http codes:
`NO_CONTENT` : Succes  
`NOT_FOUND` : Le channel n'existe pas  
___
