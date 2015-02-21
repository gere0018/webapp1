var button;
document.addEventListener("DOMContentLoaded", function(){
     function clickbutton(){
        button = document.querySelectorAll(".button");
        for(var i = 0; i<button.length; i++){
            button[i].addEventListener("click", (function(ex){
                return function(){
                    animate(ex);
                }
            })(i));
        }
     }
clickbutton();

});

function animate(i){
    var j; //next page index
    if (i=== button.length-1){
        j=0;
    }else{
        j = i+1;
    }
       button[i].parentElement.classList.add("pt-page-rotateFoldTop");
       button[j].parentElement.classList.add("pt-page-current");
       button[j].parentElement.classList.add("pt-page-moveFromBottomFade");
       setTimeout(resetPages, 700, button[i], button[j]);

}

function resetPages(page1, page2){
    page1.parentElement.classList.remove("pt-page-current");
    page1.parentElement.classList.remove("pt-page-rotateFoldTop");

    page2.parentElement.classList.remove("pt-page-moveFromBottomFade");
}

