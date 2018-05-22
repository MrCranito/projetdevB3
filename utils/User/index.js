class User{

  construct(id, socketid, username, mail, contacts){
    this.id = id;
    this.socketid = socketid;
    this.username = username;
    this.mail = mail;
    this.contacts = contacts;
  }
}

module.exports = User;
