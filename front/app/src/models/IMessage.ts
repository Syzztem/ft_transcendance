// class IMessage {
//     constructor(content :string, sender:string) {
//       this.content = content;
//       this.sender = sender;
//     }
//     content: string
//     sender:string
//   }

interface	IMessage
{
	sender:string,
	content:string,
	// sender:User,
	// channel:Channel,
	// timestamp:Date
}

export default IMessage