$(document).ready(function($){  
    $.ajax({
      url: '/countries.json',
      type: "post",
      success: function(json) {
        html = '';
        for (var i = json.length - 1; i >= 0; i--) {
              var country = json[i];
              html = html + '<option value="'+country._id+'"> '+country.name +' </option>';
            }; 
            var html_base = $('#currency_input').html();
            $('#currency_input').html(html_base+html);
      },
              
         error:function (xhr, ajaxOptions, thrownError) {
          alert(thrownError);
        }
  });
});