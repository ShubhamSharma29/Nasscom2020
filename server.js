const express=require('express');
const session=require('express-session');
const passport=require('passport');
const WebAppStrategy=require('ibmcloud-appid').WebAppStrategy;

const app=express();
const path=require('path');

app.use(session({
	secret: '123456',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));

passport.use(new WebAppStrategy({
	tenantId: "46559843-cf5e-41b3-adb3-321969823b87",
	clientId: "330893ab-a7f2-4805-a761-48a03acaff22",
	secret: "NTFhMjMwMTEtMzIzMC00MGRjLWI3YmEtN2MwMzhiMTAyMmVl",
	oauthServerUrl: "https://eu-gb.appid.cloud.ibm.com/oauth/v4/46559843-cf5e-41b3-adb3-321969823b87",
	redirectUri: "http://localhost:3000/appid/callback"
}));

app.get('/appid/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME));

app.get('/appid/logout', function(req, res){
	res.clearCookie("refreshToken");
	WebAppStrategy.logout(req);
	res.redirect('/');
});

app.use(passport.authenticate(WebAppStrategy.STRATEGY_NAME));

app.use('/static',express.static('public'));

app.get('/',function(re,res){
    res.sendFile(path.join(__dirname,'/index.html'));
});

app.listen(3000);


