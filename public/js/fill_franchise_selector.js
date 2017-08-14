$(document).ready(function($){  
 
  $.ajax({
    url: '/franchises',
    type: "post",
    success: function(json) {
      html = '';
      for (var i = json.length - 1; i >= 0; i--) {
            var franchise= json[i];
            html = html + '<span><a href="/franchises/change_franchise/'+franchise.slug+'"> ' + franchise.name + '</a></span><br>';
          }; 
          $('#SelectorFranchiseModal .modal-body').html(html)
    },
            
       error:function (xhr, ajaxOptions, thrownError) {
        //alert(thrownError);
      }
    
    
  });
});