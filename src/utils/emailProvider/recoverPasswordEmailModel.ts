export function recoverPasswordEmailModel(name: string, token: string): string {
  return `<!DOCTYPE html>
  <html>
  
    <head>

      <style>
        .container{
          width: 70%;
          max-width: 700px;
          margin: auto;
          text-align: center;
          font-family: sans-serif;
        
        }

        .btn{
          border: none;
          border-radius: 5px;
          width: 70%;
          padding: 10px;
          font-weight: bold;
          font-size: 20px;
          color: white;
          background-color: rgb(39, 41, 43);
        }

        .btn:hover{
          filter: brightness(1.4);
          cursor: pointer;
        }

        .subtext{
          font-size: 12px;
        }
      </style>
    </head>
  
    <body>
      <div class="container">
        <h1>DOTOS!</h1>
        <h2>Password recovery</h2>
        <p>Hello, ${name}! Click on the button to recover your password. If you did not request this, please ignore.</p>
        <a href="${process.env.NODE_ENV === "production"
        ? process.env.PROD_DOMAIN
        : `https://app.${process.env.DEV_DOMAIN}:${process.env.DEV_PORT}`}/changepassword/${token}"><button class="btn">Recover password</button></a>
        <p class="subtext">The link above is valid for 2 hours.</p>
      </div>
    </body>
  
  </html>`;
}
