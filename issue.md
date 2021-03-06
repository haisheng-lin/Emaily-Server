### 2018-02-01

**issue:** How to secure your API key

**solution:** Create a file to store all API keys inside. Then edit .gitignore file to skip this file

**issue:** Google Oauth: 400. That’s an error. Error: redirect_uri_mismatch

**solution:** 

- Go to modify the credentials of your API_KEY in console.developers.google.com.

- Update the authorized redirect URL as: localhost:5000/auth/google/callback instead of localhost:5000/*

**issue:** When deploy to Heroku, google auth occurs an error: 

Error: redirect_uri_mismatch

The redirect URI in the request, http://emaily-haisheng-lin.herokuapp.com/auth/google/callback, does not match the ones authorized for the OAuth client. 

**reason:**

- Google misunderstand that the redirect URL is in http not https

- Our app does not trust Heroku Proxy

**solution:**

- hardcode passport.js callback URL as: https://emaily-haisheng-lin.herokuapp.com/auth/google/callback

- add { proxy: true } option in GoogleStrategy

---

### 2018-02-02

**issue:** How to redirect user from client-side to server-side without using hardcode href in <a> tag

**solution:** 

update package.json in **client folder** with:

```
"proxy" : {
  "/auth/google": {
    "target": "http://localhost:5000"
  }
}
```

but we still get an error when redirect back from google oauth with message: redirect_uri_mismatch:
localhost:3000/auth/google/callback, does not match the ones authorized......

**how to solve it:**

go to console.developers.google.com to update credentials:

add "localhost:3000/auth/google/callback" in your authorized redirect URLs.

**but why it works?**

the proxy will automatically redirect to localhost:5000 when we access the link '/auth/google'
we just need this one in our development mode.

In production, react app is deployed on Heroku on Express Server. Because when we say deploy react app, we just run build command on react project via webpack, babel to package the files. And '/auth/google' will be the link redirected to the server domain. So that's why it works.

**Question:** 为什么把 react 放进 server 里面，部署时也只需要一个 https://www.emaily.com，而不是 https://www.emaily.com, https://www.emaily-server.com，为什么前后端不分离？

- 我们只要往客户端发送http请求使用cookie，而发送请求往服务端不会用cookie，这就不太方便

- 如果分离，那么我们发送请求往客户端，该请求是 no CORS，如果发送请求往服务端，则请求是 CORS request！

**Best Practice:** 

- class-based, functional-based component file we will name it with first capital letter like "App.js"

- if a file returns a function or something like that, we will name it with lowercase

**issue:** React 路由部分匹配也会 render component

**solution:** 

添加 exact={true} 或者直接写 exact:
```
<Route exact={ true } path="/" component={ Landing } />
```

### 2018-02-03

**issue:**

由于 API_KEY 都在存储在服务器，前端如何拿到后端的 API_KEY 呢？而且后端的 NodeJS 用的是 CommonJS modules，所以可以在输出之前加上逻辑判断，但是前端用的是 ES2015 以上的版本，我们不可以在 import 东西之前加上逻辑判断。

**solution:** 

create-react-app 可以帮助我们配置环境变量，这是链接：[传送门](https://github.com/haisheng-lin/Emaily-Server/tree/master/client#adding-custom-environment-variables)

**issue:**

当部署 app 到 Heroku 时，如何使服务器知道哪些路由是前端的，哪些路由是后端的？

**solution:** 

在 Express 的 index.js 最后加上：
```
if(process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // like main.js and main.css file
  app.use(express.static('client/build'));

  // Express will serve up index.html file if it cannot recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
```

### 2018-02-04

**issue:**

当被调查者在邮件里点击 yes/no 时，我们如何知道是哪个用户点击的？

**solution:** 

使用 SendGrid，SendGrid 对邮件里每个链接会先进行重定向到自己的服务器，然后再重定向到真正我们指定的链接，而且 SendGrid 在重定向到自己服务器时，链接会包含一个 token,这个 token 可以指向那个收到邮件的用户！

1. We tell SendGrid to send email
2. SendGrid scans the email, replaces every link with their special one
3. user clicks the link
4. SendGrid knows who clicked it
5. SendGrid can (1) user sent to destination; (2) send message to our server telling us about the click

而且，一旦 SendGrid 告诉我们有用户点击了链接，那么就会用到 webhook。

webhook is an outside API that facilitate the process that some event just occured. So that's why we need a route called "/api/surverys/webhooks" which tells us: hey, someone clicks the link you provided and you can response with some actions.

**issue:**

如何测试 SendGrid 正确地发邮件而不需要通过前端 React？

**solution:** 

在 React index.js 写上 windows.axios = require('axios')，那么就可以在浏览器调用 axios.post('/api/surveys', survey)了

### 2018-02-05

**issue:**

SurveyForm 的表单数据不希望在 render SurveyFormReview 后被清除，如何做？

**solution:** 

在 SurveyForm 的 reduxForm 配置里：

```
destroyOnUnmount: false // do not destroy the form so that when we go back, the form value keeps alive
```

**issue:**

如果用户在 SurveyForm 里按取消而我们希望再次 create surve y时表格是清空的，如何做？

**solution:** 

在 SurveyNew 里：

```
export default reduxForm({
  form: 'surveyForm'
})(SurveyNew);
```

意思是当 React unmount SurveyNew 这个 component 时（因为我们按 cancel 会重定向到 Dashboard），也把 surveyForm 里面的都清空，其实这是 React default behavior。

**issue:**

如何在做了 action 后重定向？

**solution:** 

使用 react-router-dom 里面的 withRouter，它会给 props 提供 history 对象，把这个对象传进对应的 action 里面，然后写入：

```
history.push('/surveys'); // 重定向
```

**issue:**

在 development mode 里，如何使 SendGrid callback URL 指向 localhost？

**solution:**

使用 localtunnel：给它配置一些 subdomain（必须确保唯一），由于 localtunnel 经常崩掉，所以又要借用 forever，在 sendgrid_webhook.js 里面的代码自己看看，还有在 package.json 里面：

```
"dev": "concurrently \"npm run server\" \"npm run client\" \"npm run webhook\"",
"webhook": "forever sendgrid_webhook.js"
```

### 2018-02-06

**issue:**

由于 SendGrid 返回的数据中，虽然提供了 email, event等，但不提供用户具体点击了什么按钮，我们如何得到该信息？

**solution:**

在 SurveyTemplate 里面修改每个链接的地址，变成 `/api/surveys/:surveyId/yes` 之类的。

**issue:**

但是，假如开发者因为要开发其他项目，添加了除了邮件点击之外的功能，那么我们的服务器就会收到其他我们并不关心的数据；而且，用户也可能对同一个 survey 点击了两次以上投票，实际上我们只希望用户对特定的 survey 最多投一次票。我们要怎么做？

**solution:**

逻辑：
1. 首先，我们需要清理数据，把 event != 'click'，url != '/api/surveys/:surveyId/:anwser' 这些数据清理掉
2. 清理掉重复的数据（用户对同一个 survey 投两次票以上）

做法：
我们需要 lodash, path-parser 这两个模块，