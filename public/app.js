angular.module('s3Demo', [])
.directive('fileRead', function() {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      elem.on('change', function(changeEvent) {
        var reader = new FileReader(); //grabs the content we submitted and converts it to Base64 string

        reader.readAsDataURL(changeEvent.target.files[0]);
        reader.onload = function(loadEvent) {
          var rawData = loadEvent.target.result; // <-- result is the image base64 string
          console.log(elem, rawData);
        }

      })
    }
  }
})
.service('dataService', function($http) {
  this.storeImage = function(rawData, fileName) {

    var imageExtension = imageData.split(';')[0].split('/')
    imageExtension = imageExtension[imageExtension.length - 1];
 //these two lines are parsing the data to grab the name of the file
    
    var newImage = {
      imageName: fileName,
      imageBody: rawData,
      imageExtension: imageExtension,
      userEmail: 'austinhollenbaugh@gmail.com' //req.user.email or whatever
    }

    return $http.post('/api/newimage', newImage);
  }
})
