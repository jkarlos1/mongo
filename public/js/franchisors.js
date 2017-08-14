$(document).ready(function() {
	$.ajax({
    url: '/franchises/complete_list',
    type: "post",
    success: function(json) {
      html = '';
      for (var i = json.length - 1; i >= 0; i--) {
            var franchise = json[i];
            html = html + '<option value="'+franchise._id+'"> '+franchise.name +' </option>';
          }; 
          var html_base = $('.franchises_subscription').html();
          $('.franchises_subscription').html(html_base+html);
       
    },
            
       error:function (xhr, ajaxOptions, thrownError) {
       // alert(thrownError);
      }
    
    
  });
});