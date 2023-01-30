class IMessage {
    constructor(content :string, sender:string) {
      this.content = content;
      this.sender = sender;
    }
    content: string
    sender:string
  }

  export default IMessage