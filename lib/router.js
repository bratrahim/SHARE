/**
 * Created by admin on 5/14/2017.
 */
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate:'notFound',
    waitOn: function () {
        return Meteor.subscribe('posts');
    }

});

Router.route('/', {name: 'postFeed'});
Router.route('/posts/:_id', {
    name: 'postpage',
    data: function () {
        return Posts.findOne(this.params._id);
    }
});

Router.route('/submit',{name:'postSubmit'});

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

Router.onBeforeAction('dataNotFound',{only:'postpage'});
Router.onBeforeAction(requireLogin,{only:'postSubmit'});