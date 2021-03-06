var app = angular.module("QueGui", {});

// the top nav colors
var navColorYellow = "#FCBD4B";
var navColorRed = "#FC4B4B";
var navColorBlue = "#4BA9FC";
var navColorGreen = "#42BF3F";
var navColorBrown = "#B7521E";

app.controller("navController", function($scope) {
  var root = this;

  this.pageId = 1;

  this.toPage = function(id) {

    // set page id
    this.pageId = id;

    // fade the colors in the top navbar
    $(".navbar-que").animate({
      backgroundColor: root.getPageColor()
    }, 350);
  }


  // get title area of navbar's color
  this.getPageColor = function() {
    switch (this.pageId) {
      case 0:
        return navColorYellow;
        break;
      case 1:
        return navColorGreen;
        break;
      case 2:
        return navColorBlue;
        break;
      case 3:
        return navColorRed;
        break;
      case 4:
        return navColorBrown;
        break;
    }
  }

  // get the page's title
  this.getPageTitle = function() {
    switch (this.pageId) {
      case 0:
        return {title: "Overview", desc: "Overview of everything happening on this Que instance"};
        break;
      case 1:
        return {title: "My Things", desc: "A list of all your things"};
        break;
      case 2:
        return {title: "My Services", desc: "A list of all services linked to this Que instance"};
        break;
      case 3:
        return {title: "Notifications", desc: "Notifications from Things and Services"};
        break;
      case 4:
        return {title: "Settings", desc: "Adjust preferences for this Que instance"};
        break;
    }
  }

  this.toPage(0); // go to thing page to start (for now, will be changed back to dashboard later)
});

app.controller("ThingsController", function($scope, $http, thingService, $interval, $document) {
  var root = this;

  this.selectedThing = null;

  // thing authentication key
  this.authKey = null;

  // select a thing
  this.selectThing = function(thing, event) {
    clickable = $(event.target).hasClass("card-move");
    cardWidth = $(".card").first().width();

    if (event.button != 0 || !clickable) return true;

    var selectThingRoot = this;
    var move = false;

    falseFunction = function(){return false;}
    $("*").mousedown(falseFunction);

    // on movement
    mousemove = function(event) {
      selectThingRoot.selectedThing = thing.id;
      $('.card.above').css('left', ($(document).width()-cardWidth)/2-4 );
      $('.card.above').css('top', event.pageY);
      move = true;
    };

    // unbide and destruct
    mouseup = function(event) {
      root.selectedThing = null;
      if (!move) {
        return true;
      }
      $document.unbind('mousemove', mousemove);
      $document.unbind('mouseup', mouseup);
      $("*").unbind('mousedown', falseFunction);
      $('.card.above').css('left', 0);
      $('.card.above').css('top', 0);

      // where to reorder?
      Ry = Math.floor( event.pageY / $(".card").height() );

      // do the reorder
      root.things.splice( root.things.indexOf(thing), 1 );
      root.things.splice(Ry, 0, thing);

      // make the request
      thingService.reorderThing(thing.id, Ry, function() {

      });

      // update angular
      $scope.$apply();
    };

    $document.on('mousemove', mousemove);
    $document.on('mouseup', mouseup);
  };

  // get all data from server
  thingService.getAllThings(function(data) {
    root.things = data;
  });

  // given a data type, get the textbox type it would go into
  this.getTypeFor = function(value) {
    if (value.type) {
      return value.type;
    } else {
      switch (typeof value.value) {
        case "number":
          return "number";
          break;
        case "boolean":
          return "checkbox";
          break;
        default:
          return "text";
          break;
      }
    }
  }

  // is this control represented as a button?
  this.isButton = function(v) {
    return v.type == "button";
  }

  // update backend on keypress
  this.updateThingData = function(id, key, value, callback) {
    data = {}
    data[key] = value;

    thingService.updateThingData(id, data, callback || function() {});
  }

  // convert from CamelCase or underscore-format to normal, smaced words
  this.convertIntoSpaces = function(string) {
    string = string
      // insert a space between lower & upper
  		.replace(/([a-z])([A-Z])/g, '$1 $2')
  		// space before last upper in a sequence followed by lower
  		.replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
  		// uppercase the first character
  		.replace(/^./, function(str){ return str.toUpperCase(); })// insert a space between lower & upper
  		.replace(/([a-z])([A-Z])/g, '$1 $2')
  		// space before last upper in a sequence followed by lower
  		.replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
  		// uppercase the first character
  		.replace(/^./, function(str){ return str.toUpperCase(); })
    return string.replace('-', ' ').replace('_', ' ');
  }

  // generate an authentication key
  // used for adding a new thing
  this.generateAuthKey = function() {
    thingService.genAuthKey(function(data) {
      root.authKey = data.key || null;
    });
  }
  this.generateAuthKey();

  this.removeThing = function(id, index) {
    root.things.splice(index, 1);
    thingService.removeThing(id, function() {});
  }

  socket.on('backend-data-change', function(data) {
    thingService.getAllThings(function(data) {
      if ($(':focus').length == 0) {
        // if a new item was added, hide the modal
        if (root.things.length !== data.length) {
          $("#addThingModal").modal('hide');
          root.generateAuthKey();
        }

        // update the data
        root.things = data;
      }
    });
  });

});

app.controller("ServicesController", function($scope, $http, servicesService, $interval, $document) {
  var root = this;

  this.selectedThing = null;

  // service authentication key
  this.authKey = null;

  // select a thing
  this.selectThing = function(thing, event) {
    clickable = $(event.target).hasClass("card-move");
    cardWidth = $(".card").last().width();

    if (event.button != 0 || !clickable) return true;

    var selectThingRoot = this;
    var move = false;

    falseFunction = function(){return false;}
    $("*").mousedown(falseFunction);

    // on movement
    mousemove = function(event) {
      selectThingRoot.selectedThing = thing.id;
      $('.card.above').css('left', ($(document).width()-cardWidth)/2-4 );
      $('.card.above').css('top', event.pageY);
      move = true;
    };

    // unbide and destruct
    mouseup = function(event) {
      root.selectedThing = null;
      if (!move) {
        return true;
      }
      $document.unbind('mousemove', mousemove);
      $document.unbind('mouseup', mouseup);
      $("*").unbind('mousedown', falseFunction);
      $('.card.above').css('left', 0);
      $('.card.above').css('top', 0);

      // where to reorder?
      Ry = Math.floor( event.pageY / $(".card").height() );

      // do the reorder
      root.things.splice( root.things.indexOf(thing), 1 );
      root.things.splice(Ry, 0, thing);

      // make the request
      servicesService.reorderThing(thing.id, Ry, function() {

      });

      // update angular
      $scope.$apply();
    };

    $document.on('mousemove', mousemove);
    $document.on('mouseup', mouseup);
  };

  // get all data from server
  servicesService.getAllThings(function(data) {
    root.things = data;
  });

  // given a data type, get the textbox type it would go into
  this.getTypeFor = function(value) {
    if (value.type) {
      return value.type;
    } else {
      switch (typeof value.value) {
        case "number":
          return "number";
          break;
        case "boolean":
          return "checkbox";
          break;
        default:
          return "text";
          break;
      }
    }
  }

  // is this control represented as a button?
  this.isButton = function(v) {
    return v.type == "button";
  }

  // update backend on keypress
  this.updateThingData = function(id, key, value, callback) {
    data = {}
    data[key] = value;

    servicesService.updateThingData(id, data, callback || function() {});
  }

  // convert from CamelCase or underscore-format to normal, smaced words
  this.convertIntoSpaces = function(string) {
    string = string
      // insert a space between lower & upper
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // space before last upper in a sequence followed by lower
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
      // uppercase the first character
      .replace(/^./, function(str){ return str.toUpperCase(); })// insert a space between lower & upper
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // space before last upper in a sequence followed by lower
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
      // uppercase the first character
      .replace(/^./, function(str){ return str.toUpperCase(); })
    return string.replace('-', ' ').replace('_', ' ');
  }

  this.removeThing = function(id, index) {
    root.things.splice(index, 1);
    servicesService.removeThing(id, function() {});
  }

  // generate an authentication key
  // used for adding a new service
  this.generateAuthKey = function() {
    servicesService.genAuthKey(function(data) {
      root.authKey = data.key || null;
    });
  }
  this.generateAuthKey();

  // $interval(function(){
  //   servicesService.getAllThings(function(data) {
  //
  //     if ( angular.toJson(root.things) != angular.toJson(data) ) {
  //
  //       // if a new item was added, hide the modal
  //       if (root.things.length !== data.length) {
  //         $("#addServiceModal").modal('hide');
  //         root.generateAuthKey();
  //       }
  //
  //       // update the data
  //       root.things = data;
  //     }
  //
  //   });
  // }, 1000);

  socket.on('backend-data-change', function(data) {
    servicesService.getAllThings(function(data) {
      if ($(':focus').length == 0) {
        // if a new item was added, hide the modal
        if (root.things.length !== data.length) {
          $("#addThingModal").modal('hide');
          root.generateAuthKey();
        }

        // update the data
        root.things = data;
      }
    });
  });

});

app.controller("DashboardController", function($scope, servicesService, thingService) {
  var root = $scope;

  // thing count
  root.thingCount = 0;
  root.getThingCount = function() {
    thingService.getAllThings(function(data) {
      root.thingCount = data.length;
    });
  }
  root.getThingCount();

  // service count
  root.serviceCount = 0;
  root.getServiceCount = function() {
    servicesService.getAllThings(function(data) {
      root.serviceCount = data.length;
    });
  }
  root.getServiceCount();

});

app.directive("thingCardList", function() {
  return {
    restrict: 'E',
    templateUrl: "js/directives/thing-card-list.html"
  }
});

app.directive("serviceCardList", function() {
  return {
    restrict: 'E',
    templateUrl: "js/directives/service-card-list.html"
  }
});

app.directive("dashboardOverview", function() {
  return {
    restrict: 'E',
    templateUrl: "js/directives/dashboard-overview.html"
  }
});


app.factory("thingService", function($http) {
    thingservice = {
      cache: {},

      getAllThings: function(callback) {
        $http({
          method: "get",
          url: host + "/things/all",
        }).success(function(data) {
          callback(data.data);
        });
      },

      // get thing data
      // try from cache, but fall back onto
      // a http request
      getThingData: function(id, callback) {
        if (this.cache[id]) {
          callback(this.cache[id]);
        } else {
          $http({
            method: "get",
            url: host + "/things/" + id + "/data",
          }).success(function(data) {
            thingservice.cache = data;
            callback(data);
          });
        }
      },

      updateThingData: function(id, data, callback) {
        // push it back to te server
        socket.emit('push-thing-data-update', {
          id: id,
          data: data
        });

        // $http({
        //   method: "put",
        //   url: host + "/things/" + id + "/data",
        //   data: JSON.stringify(data)
        // }).success(function(data) {
        //   callback(data);
        // });
      },

      reorderThing: function(id, newLocation, callback) {
        $http({
          method: "get",
          url: host + "/things/" + id + "/location/" + newLocation,
        }).success(function(data) {
          callback(data);
        });
      },

      removeThing: function(id, callback) {
        $http({
          method: "delete",
          url: host + "/things/" + id,
        }).success(function(data) {
          callback(data);
        });
      },

      genAuthKey: function(callback) {
        $http({
          method: "get",
          url: host + "/things/genkey",
        }).success(function(data) {
          callback(data);
        });
      }

    };

    // update thing cache
    socket.on('pull-thing-data-update', function(changed) {

      // create the item if it doesn't exist
      if (!thingservice.cache[changed.id]) {
        thingservice.cache[changed.id] = {};
      }

      // update cache
      _.each(changed.data, function(v, k) {
        thingservice.cache[changed.id][k] = v;
      });

    });
    return thingservice;
 });


app.factory("servicesService", function($http) {
    serviceservice = {
      cache: {},

      getAllThings: function(callback) {
        $http({
          method: "get",
          url: host + "/services/all",
        }).success(function(data) {
          callback(data.data);
        });
      },

      getThingData: function(id, callback) {
        if (this.cache[id]) {
          callback(this.cache[id]);
        } else {
          $http({
            method: "get",
            url: host + "/services/" + id + "/data",
          }).success(function(data) {
            serviceservice.cache = data;
            callback(data);
          });
        }
      },

      updateThingData: function(id, data, callback) {
        socket.emit('push-service-data-update', {
          id: id,
          data: data
        });

        // $http({
        //   method: "put",
        //   url: host + "/services/" + id + "/data",
        //   data: JSON.stringify(data)
        // }).success(function(data) {
        //   callback(data);
        // });
      },

      reorderThing: function(id, newLocation, callback) {
        $http({
          method: "get",
          url: host + "/services/" + id + "/location/" + newLocation,
        }).success(function(data) {
          callback(data);
        });
      },

      removeThing: function(id, callback) {
        $http({
          method: "delete",
          url: host + "/services/" + id,
        }).success(function(data) {
          callback(data);
        });
      },

      genAuthKey: function(callback) {
        $http({
          method: "get",
          url: host + "/services/genkey",
        }).success(function(data) {
          callback(data);
        });
      }

    };

    // update thing cache
    socket.on('pull-service-data-update', function(changed) {

      // create the item if it doesn't exist
      if (!serviceservice.cache[changed.id]) {
        serv.cache[changed.id] = {};
      }

      // update cache
      _.each(changed.data, function(v, k) {
        serv.cache[changed.id][k] = v;
      });
    });
    return serviceservice;
 });
