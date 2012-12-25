function update(){
    // update
}

function init()
{
  surface = document.querySelector("#game");
  cr = surface.getContext("2d");
  setInterval(update, 100);
  draw();
}