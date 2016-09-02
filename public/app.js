angular.module('s3Demo', [])
.directive('fileRead', function(dataService) {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      elem.on('change', function(changeEvent) {
        var reader = new FileReader(); //grabs the content we submitted and converts it to Base64 string

        reader.readAsDataURL(changeEvent.target.files[0]);
        reader.onload = function(loadEvent) {
          var rawData = loadEvent.target.result; // <-- result is the image base64 string
          console.log('rawData', rawData);
          console.log('element', elem);

          var tempArray = elem[0].value.split('\\');
          var fileName = tempArray[tempArray.length - 1];

          // var imageExtension = rawData.split(';')[0].split('/');
          // var fileName= imageExtension[imageExtension.length - 1];
          //these two lines are parsing the data to grab the name of the file
          // console.log('image extension', imageExtension);
          console.log('filename', fileName);

          // var tempArray = elem['context'].value.split('\\');
          // var fileName = tempArray[tempArray.length - 1];

        dataService.storeImage(rawData, fileName)
        .then(function (result) {
          console.log('result', result.data);
          scope.images.push(result.data.Location);
        })
        .catch(function (err) {
          console.error(err);
        });
        }

      })
    }
  }
})
.service('dataService', function($http) {
  this.storeImage = function(rawData, fileName) {

   var imageExtension = rawData.split(';')[0].split('/')
      imageExtension = imageExtension[imageExtension.length - 1];
   console.log('image extension', imageExtension);
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
