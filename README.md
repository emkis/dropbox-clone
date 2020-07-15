![an easy way to store, share and access files from anywhere](https://github.com/emkis/dropbox-clone/blob/master/.github/dropbox-clone-banner.png?raw=true)


# :page_with_curl: about
this is a beautiful web app project that you can use for **store, share and acess files any time from anywhere**

i made this project for fun and also to challenge myself in learn more about reactjs

**[you can see live app here](https://dropbox-clone.herokuapp.com)**

# :pushpin: features

### realtime
everything that happens is **always in sync**, if you add something, if someone change something, this app stays updated always

### storage & share files
you can upload any files you want, share with someone instantly, or you can send the folders link to a friend

### organize your files
you can also create folders for organizing your files better

# :hammer: how it was built
this project was developed with the following technologies:

- [ReactJS](https://github.com/facebook/react/)
- CSS only
- [Socket.IO](https://github.com/socketio/socket.io-client)
- [Axios](https://github.com/axios/axios)

# :speech_balloon: rest api
all data is being consumed from an rest api written in node, you can check the [repo here](https://github.com/emkis/dropbox-clone-api)

# :information_source: note
every file you store here is deleted about every 30 minutes, so dont worry 😉

the api that storages all files is hosted on [heroku](https://www.heroku.com/), and heroku always erase everything when the app is restarted, thats why it happen

but if you use another host service for the api you can use this app without this prolem

# :electric_plug: how to use
to clone this repository and run this app, you'll need **[git](https://git-scm.com)** and **[node.js](https://nodejs.org/en/)** installed on your computer.

i highly recommend **[yarn](https://yarnpkg.com/)** for handling node packages faster, but you can use npm if you want, no problem.

**from your command line *(using npm)*:**

```bash
# clone this repository
$ git clone https://github.com/emkis/dropbox-clone.git

# go into the repository
$ cd dropbox-clone

# create a .env file based on the example and define the api url
# you can use the api that is used in production: https://dropbox-clone-back.herokuapp.com
$ cp .env.example .env

# install dependencies
$ npm install

# run the app in development mode
$ npm run start
```

---

:v: **[say hello](https://www.linkedin.com/in/nicolas-jardim/)** to me on linkedin or send me and **[email](mailto:nicolasemkis@gmail.com)** :mailbox:
