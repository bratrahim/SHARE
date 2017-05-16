import {Template} from 'meteor/templating';

Meteor.subscribe('posts');

Template.postFeed.helpers(
    {
        posts: function () {
            return Posts.find({}, {sort: {submitted: -1}});
        }
    });

Template.comment.helpers(
    {
        username:function(){
            return Meteor.users.findOne({_id:this.userId}).username;
        },
        date:function(){
            return moment(this.timestamp).fromNow();

        },
    }
);

Template.post_card.helpers(
    {
        //query for counting likes
        likes: function () {
            var post= Posts.findOne({_id: this._id});
            return post.liked.length;
        },
        numberofcomments: function () {
            var post= Posts.findOne({_id: this._id});
            return post.comments.length;
        }
    }
);

Template.post_card.events({
    "click .likeButton": function (parentContext) {
        if(Meteor.userId())
        {
            var post = Posts.findOne({_id: this._id});
            var setOfIds = post.liked;
            console.log(String(Meteor.userId()));
            console.log(setOfIds);
            if(setOfIds.includes(Meteor.userId()))
            {
                //do on server side
                Posts.update({_id: this._id}, {$pull: {liked:  String(Meteor.userId())}});
            }
            else
            {
                //do on server side
                Posts.update({_id: this._id}, {$push: {liked:  String(Meteor.userId())}});
            }
        }
        else alert("login");
    },
    "click .commentSubmit": function (parentContext) {
        var comment=$('.comment-textarea').val();
        //do on server side
        Posts.update({_id: this._id}, {$push: {comments:  {userId:String(Meteor.userId()),timestamp:new Date(),comment:comment}}});
    }
});

Template.postSubmit.events({
    "submit form": function (e) {
        e.preventDefault();

        var post = {
            img: $(e.target).find('[name=imageUrl]').val(),
            description: $(e.target).find('[name=description]').val()
        };
        Meteor.call('postInsert', post, function (error, result) {
            if (error)
                return alert(error.reason);
            Router.go('postpage', {_id: result._id});
        })
    }
});

