'use strict';

/*
* Main script
* When button of popup is pressed
*/
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
    console.log(request);

    // Getl all text nodes
    var textNodes = getTextNodesUnder(document.documentElement), val, textNode, color, images, bgImages, styles, inputs, attr;

    for (var i = textNodes.length - 1; i >= 0; i--) {
      if (textNodes[i].parentNode.tagName !== 'SCRIPT') {
        textNode = textNodes[i];
        val = textNode.nodeValue;

        // Replace cyrrilic symbols to random latin
        textNodes[i].nodeValue = replaceCyrrilic(val);

        // Set font and other styles to the node
        color = window.getComputedStyle(textNode.parentNode).color;
        color = color.replace(/(rgb)(\(\d+, \d+, )(\d+)(\))/gi, function(match, p1, p2, p3, p4) {
          return p1 + 'a' + p2 + p3 + ', ' + request.fontOpacity + p4;
        });
        styles = '' +
        'font-family:'            + 'Blokk;' +
        'font-weight:'            + 'normal;' +
        '-webkit-font-smoothing:' + 'antialiased;' +
        'letter-spacing:'         + '0;' +
        'color:'                  +  color + '!important;' +
        'text-shadow:'            + 'none';

        textNode.parentNode.setAttribute('style', styles);
      }
    };

    /* Inputs placeholders */
    if (request.inputsOpt) {
      inputs = document.getElementsByTagName('input');
      if (request.inputsOpt === 'blokk') {
        styles = '' +
          'font-family:'            + 'Blokk;' +
          'font-weight:'            + 'normal;' +
          '-webkit-font-smoothing:' + 'antialiased;' +
          'letter-spacing:'         + '0;';
        for (var i = inputs.length - 1; i >= 0; i--) {
          attr = inputs[i].getAttribute('placeholder');
          inputs[i].setAttribute('placeholder', replaceCyrrilic(attr));
          inputs[i].setAttribute('style', styles);
        }
      } else {
        for (var i = inputs.length - 1; i >= 0; i--) {
          inputs[i].setAttribute('placeholder', '');
        }
      }
    }

    /* Blur images */
    if (request.blurImg) {
      // Blur images
      images = getImages();
      for (var i = images.length - 1; i >= 0; i--) {
        images[i].setAttribute('style', '-webkit-filter: blur(3px); filter: blur(3px);');
      };
    }

    // Todo: It blurs not only background but contents of the nodes also
    // bgImages = getBgNodesUnder(document.documentElement);
    // for (var i = bgImages.length - 1; i >= 0; i--) {
    //   bgImages[i].setAttribute('style', '-webkit-filter: blur(13px); -moz-filter: blur(13px); -o-filter: blur(13px); -ms-filter: blur(13px); filter: blur(13px);');
    // };
});



/*
* Helpers
*/

function getTextNodesUnder(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}


function getBgNodesUnder(el){
  var n, nodes=[],
  nodeIterator = document.createNodeIterator(
    // Node to use as root
    el,

    // Only consider nodes that are text nodes (nodeType 3)
    NodeFilter.SHOW_ELEMENT,

    // Object containing the function to use for the acceptNode method
    // of the NodeFilter
    { acceptNode: function(node) {
        // Logic to determine whether to accept, reject or skip node
        // In this case, only accept nodes that have content
        // other than whitespace
        var styles = window.getComputedStyle(node);
        if (styles['background-image'] != 'none') {
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    },
    false
  );
  while(n=nodeIterator.nextNode()) nodes.push(n);
  return nodes;
}


function replaceCyrrilic (str) {
  if (!str) return;
  return str.replace(/[а-я]|ё/gi, function (match) {
    var character = getRandomLetter();
    if (match == match.toUpperCase()) {
      character = character.toUpperCase();
    }
    return character;
  });
}


function getRandomLetter() {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz";
  return possible.charAt(Math.floor(Math.random() * possible.length));
}


function getImages() {
  return document.getElementsByTagName('img');
}