import http from "../http-common";

class EmailDataService {
  getAll() {
    return http.get("/emails");
  }


  get(email) {
    return http.post('/emails', {
      email: email
    })
  }

  getData(name, zip) {
    return http.post('/name', {
      name: name,
      zip: zip
    })
  }

  getByName(name, other) {
    // return http.post('/emails', {
    //   name: name,
    //   zip: other
    // })
    return http.post('/names', {
      name: name,
      zip: other
    })
  }

  subscribeEmail(email)
  {
    return http.post('/subscribe',
    {
      email:email
    })
  }

}

export default new EmailDataService();