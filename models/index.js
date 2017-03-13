var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
	logging: false
});

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING, //Sequelize.STRING is a function can take an argument for the character limit
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING, 
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT, //(no size constraint as in STRING)
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed') // built in validation
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        set: function(value) {
            var arrayOfTags;
            if(typeof value === 'string'){
                arrayOfTags = value.split(',').map(function(s){
                    return s.trim();
                });
                this.setDataValue('tags, arrayOfTags');
            } else {
                this.setDataValue('tags', value);
            }   
        }
    }
}, {
    hooks: {
        beforeValidate: function (page){
            page.urlTitle = generateUrlTitle(page.title);
            }
        },
    getterMethods: {
        route: function(){
            return '/wiki/'+ this.urlTitle;
        } // this is called a virtual
    }    
});

// Page.hook('beforeValidate', function(page, options){
// 	page.urlTitle = generateUrlTitle(page.title);
// }) //options?? what is this for?


var User = db.define('user', {
    name: {
        type: Sequelize.STRING 
        //allowNull: false
    },
    email: {
        type: Sequelize.STRING, 
        allowNull: false,
        unique: true,
        validate: {isEmail: true} //SEQUELIZE checks that regex actually checks this
    },    
});

Page.belongsTo(User, { as: 'author' });

module.exports = {
  Page: Page,
  User: User
};

function generateUrlTitle (title) {
  if (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2, 7);
  }
}