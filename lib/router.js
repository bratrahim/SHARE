/**
 * Created by admin on 5/14/2017.
 */
//configs
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate:'notFound',
    waitOn: function () {
        return Meteor.subscribe('posts');
    }
});

//main page
Router.route('/', {name: 'postFeed'});

//post page
Router.route('/posts/:_id', {
    name: 'postpage',
    data: function () {
        return Posts.findOne(this.params._id);
    }
});
Router.onBeforeAction('dataNotFound',{only:'postpage'});

//user page
Router.route('/users/:_id',{
   name:'userprofile',
    data: function () {
        return Meteor.users.findOne(this.params._id);
    }
});
Router.onBeforeAction('dataNotFound',{only:'userprofile'});

//post submit page
var requireLogin = function(){
    if(! Meteor.user())
    {
        if(Meteor.loggingIn())
        {
            this.render(this.loadingTemplate);
        }
        else
        {
            this.render('accessDenied')
        }
    }
    else {
        this.next();
    }
};
Router.route('/submit',{name:'postSubmit'});
Router.onBeforeAction(requireLogin,{only:'postSubmit'});



