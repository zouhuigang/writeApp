Character.Control.Navigation = Character.Control.extend({
  name: 'navigation',

  defaults: {
    back: false,
    forward: false,
    reset: true,
    add: true,
    imgRadio: true,
    update: true,
  },


  initialize: function() {
    var div = document.createElement('div');
    var tplReset = '';
    var tplAdd = '';
    var tplRadio = '';
    var tplUpdate = '';


    if (this.opts.imgRadio) {
      tplRadio = tplRadio + '<div class="Character-navigation-radio"><button class="Character-navigation-radio-blank" data-radio="blank">blank</button><button class="Character-navigation-radio-grid" data-radio="grid">grid</button></div>';
      div.innerHTML = tplRadio;
      this.el.appendChild(div.firstChild);
    };
    if (this.opts.reset) {
      tplReset = tplReset + '<button class="Character-control-navigation-reset">&times;</button>';
      div.innerHTML = tplReset;
      this.el.appendChild(div.firstChild);
    };
    if (this.opts.add) {
      tplAdd = tplAdd + '<button class="Character-control-navigation-add">addChar</button>';
      div.innerHTML = tplAdd;
      this.el.appendChild(div.firstChild);
    };
    if (this.opts.update) {
      tplUpdate = tplUpdate + '<button class="Character-control-navigation-update">update</button>';
      div.innerHTML = tplUpdate;
      this.el.appendChild(div.firstChild);
    }


    // var myEvent = new CustomEvent("myevent", {
    //   detail: {
    //     foo: "bar"
    //   },
    //   bubbles: true,
    //   cancelable: false
    // });

    // this.el.addEventListener('myevent', function(event) {
    // });
    this.el.getElementsByClassName("Character-control-navigation-reset")[0].addEventListener('click', function() {
      // this.el.dispatchEvent(myEvent);
      this.board.strokeArray.length = 0;
      this.board.initGrid();
      this.board.reset();
    }.bind(this), false);

    var buttonArray = Array.prototype.slice.call(this.el.querySelectorAll('button[data-radio]'), 0);
    buttonArray.forEach(function(e) {
      e.addEventListener("click", function(e) {
        var value = e.currentTarget.getAttribute('data-radio');
        var mode = this.board.getRadio();
        if (mode !== value) {
          this.board.setRadio(value);
        }
        this.changeButtons(this.board.getRadio());
        e.preventDefault();
      }.bind(this), false);
    }.bind(this));

    this.changeButtons(this.board.getRadio());


    // this.el.dispatchEvent(myEvent);
  },
  changeButtons: function(radio) {
    var buttonArray = Array.prototype.slice.call(this.el.querySelectorAll('button[data-radio]'), 0);
    buttonArray.forEach(function(element, index, array) {
      if (element) {
        var item = element;
        if (radio === item.getAttribute('data-radio')) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      }
    });

  }
});