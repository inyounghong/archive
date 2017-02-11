$(document).ready(function(){
 $.get('http://localhost:3000/data', {}, function(data){
     $("#results").text(JSON.stringify(data, null, '\t'));
      console.log(data)
 });
});
