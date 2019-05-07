function checkWidth(init) {
  /*If browser resized, check width again */
  if (screen.width < 480) {
    $("#mainNavbar").removeClass("m-5");
    $("#results").removeClass("m-5");
  }
}
$(document).ready(function() {
  checkWidth(true);
  setInterval(getInfo, 120000);
  if (
    localStorage.graphCryptoArray == null ||
    localStorage.graphCryptoArray == undefined ||
    localStorage.graphCryptoArray.length == 0
  ) {
    graphCryptoArray = new Array();
  } else {
    graphCryptoArray = localStorage.graphCryptoArray;
  }
  $(window).resize(function() {
    checkWidth(false);
  });


});

let cryptoIDForGraph = null;
console.log("auto");
searchInArray = () => {
  let searchArray = [];
  let searchInput = document.getElementById("searchInput").value;
  console.log(searchInput);
  if (localStorage.cryptoArray) {
    searchArray = JSON.parse(localStorage.cryptoArray);
  } else {
    searchArray = cryptoArray;
  }
  console.log(searchArray);
  let resultsArray = searchArray.filter(k =>
    k.symbol.toLowerCase().includes(searchInput.toLowerCase())
  );
  // printCryptoBySearch(resultsArray);
  printCryptoBySearch(resultsArray);
  console.log(resultsArray);
};

getInfo = () => {
  let cryptoArray = [];
  const myUrl = `https://api.coingecko.com/api/v3/coins/list`;

  $.ajax({
    type: "GET",
    datatype: "json",
    url: myUrl,

    success: function(data1) {
      console.log(data1);
      if (localStorage.graphCryptoArray) {
        cryptoArray = data1.map(x => {
          x.symbol = x.symbol.toString().toUpperCase();
          if (localStorage.graphCryptoArray.includes(x.symbol)) {
            x.checked = "checked";
          } else {
            x.checked = "";
          }
          return x;
        });
        console.log(cryptoArray);
        $("#results").html("");
        let counter = 100;
        localStorage.cryptoArray = JSON.stringify(cryptoArray);
        let availableTags = [];

        cryptoArray.forEach(v => {
          availableTags.push(v.symbol);
        });

        $("#searchInput").autocomplete({
          source: availableTags,
          minLength: 1
        });

        printCrypto(cryptoArray);
      } else {
        cryptoArray = data1.map(x => {
          x.symbol = x.symbol.toString().toUpperCase();
          // if (localStorage.graphCryptoArray.includes(x.symbol)) {
          //   x.checked = "checked";
          // } else {
          //   x.checked = "";
          // }
          return x;
        });
        console.log(cryptoArray);
        $("#results").html("");
        let counter = 100;
        localStorage.cryptoArray = JSON.stringify(cryptoArray);
        printCrypto(cryptoArray);
      }
    },
    error: function(err) {
      console.log("error : ", err);
    }
  });
};

printExtraInfo = (arr, num, numID) => {
  console.log("mustshow");


  $("#" + num).html(`<div >
                                <img src="${arr.image.small}"/>
                                  <h4>${arr.name}</h4><br><br>
                                 <h6>USD Price :${
                                   arr.market_data.current_price.usd
                                 } $</h6><br>
                                 <h6>EUR Price :${
                                   arr.market_data.current_price.eur
                                 } €</h6><br>
                                 <h6>ILS Price :${
                                   arr.market_data.current_price.ils
                                 } ₪</h6>
                            <button type="button"  id="s${numID}" class=" btn btn-primary" 
      }" data-toggle="modal"  data-target="#exampleModal" > Less Info </button>
                             </div> 
`);
  // $("#" + num).slideToggle(200);
  console.log("showed");
  $("#"+numID).hide();
  $("#s" + numID).on("click", function() {
    $("#" + num).slideUp(200);
    // $("#" + num).html("");
    $("#" + numID).show()
    $("#" + numID).removeAttr("id");

  });
};

openUpModal = data6 => {
  $("#modal")
    .html(`<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">You reached the maximum amount of coins</h5>
        <p> please remove any amount of coins to proceed</p>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div id="modalBody" class="modal-body">
        
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>`);
  for (let i = 0; i < data6.length - 1; i++) {
    $("#modalBody").append(`

                          <div class="modal-item">
                                    <h6 class="modal-title" id="exampleModalLongTitle">${
                                      data6[i]
                                    }</h6>
                              
                                  <label class="switch">
                                                      <input type="checkbox" class="cryptoCheckbox top-left" checkID="${
                                                        data6[i]
                                                      }"  checked>
                                                          <span class="slider round"></span>
                                                  </label>
                                </div>
`);
  }

  $("#exampleModalCenter").modal("show");
  let deletedArray = [];
  $('input[type="checkbox"]').on("change", function() {
    cryptoIDForGraph = $(this).attr("checkID");
    console.log(graphCryptoArray);
    if (graphCryptoArray.length < 6) {
      if ($(this).prop("checked") == true || $(this).attr("checked") == true) {
        cryptoIDForGraph = $(this).attr("checkID");
        graphCryptoArray.push(cryptoIDForGraph);
        localStorage.graphCryptoArray = JSON.stringify(graphCryptoArray);
      }
    }

    if (graphCryptoArray.length == 6) {
      console.log(graphCryptoArray);
      $(this).prop("checked", false);
      graphCryptoArray.splice(6, 1);
      openUpModal(graphCryptoArray);
    }

    // localStorage.graphCryptoArray = JSON.stringify(graphCryptoArray);

    if ($(this).prop("checked") == false || $(this).attr("checked") == false) {
      let deleteCryptoIDForGraph = $(this).attr("checkID");
      graphCryptoArray.forEach(x => {
        if (x.symbol == deleteCryptoIDForGraph) {
          x.checked = "";
        }
      });
      let indexForDelete = graphCryptoArray.findIndex(
        x => x === deleteCryptoIDForGraph
      );
      console.log(indexForDelete);
      deletedArray.push(deleteCryptoIDForGraph);
      console.log(graphCryptoArray);
      graphCryptoArray.splice(indexForDelete, 1);
      console.log(graphCryptoArray);
      localStorage.graphCryptoArray = JSON.stringify(graphCryptoArray);
    }
  });

  $("#exampleModalCenter").on("hidden.bs.modal", function() {
    for (let i = 0; i < deletedArray.length; i++) {
      $(`#${deletedArray[i]}`).attr("checked", "false");
    }
    getInfo();
  });
};

printCryptoBySearch = dato => {
  $("#results").html("");
  console.log(dato);
  for (k = 0; k < dato.length; k++) {
    $("#results").append(`
            <div class="card resultCard">
                <div class="card-body">
                        <label class="switch">
                            <input id="${
                              dato[k].symbol
                            }" type="checkbox" class="cryptoCheckbox" checkID="${
      dato[k].symbol
    }" >
                                <span class="slider round"></span>
                        </label>
                        <h5 class="card-title">${dato[k].symbol}</h5>
                        <br>
                        <h6 class="card-subtitle mb-2 text-muted">${
                          dato[k].name
                        }</h6>
                  
                        <div class="extraInfo" id="panel${k}"></div>
                        <button type="button" rid="panel${k}" id="button${k}" class="infoButton btn btn-primary" infoid = "${
      dato[k].id
    }" data-toggle="modal" data-target="#exampleModal"> More Info  </button>
                 </div>
            </div>`);
  }
  $(".infoButton").on("click", function() {
    let num = $(this).attr("rid");

    let numID = $(this).attr("id");
    let cryptoID = $(this).attr("infoid");

    $("#" + num).html(`<div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            </div>`);

    getInfoByID(cryptoID, num, numID);
  });
  $('input[type="checkbox"]').on("change", function() {
    cryptoIDForGraph = $(this).attr("checkID");
    console.log(graphCryptoArray);
    if (graphCryptoArray.length < 6) {
      if ($(this).prop("checked") == true || $(this).attr("checked") == true) {
        cryptoIDForGraph = $(this).attr("checkID");
        graphCryptoArray.push(cryptoIDForGraph);
        localStorage.graphCryptoArray = JSON.stringify(graphCryptoArray);
      }
    }

    if (graphCryptoArray.length == 6) {
      console.log(graphCryptoArray);
      $(this).prop("checked", false);
      graphCryptoArray.splice(6, 1);
      openUpModal(graphCryptoArray);
    }

    // localStorage.graphCryptoArray = JSON.stringify(graphCryptoArray);

    if ($(this).prop("checked") == false || $(this).attr("checked") == false) {
      let deleteCryptoIDForGraph = $(this).attr("checkID");
      graphCryptoArray.forEach(x => {
        if (x.symbol == deleteCryptoIDForGraph) {
          x.checked = "";
        }
      });
      let indexForDelete = graphCryptoArray.findIndex(
        x => x === deleteCryptoIDForGraph
      );
      console.log(indexForDelete);
      console.log(graphCryptoArray);
      graphCryptoArray.splice(indexForDelete, 1);
      console.log(graphCryptoArray);
      localStorage.graphCryptoArray = JSON.stringify(graphCryptoArray);
    }
  });

  // $('input[type="checkbox"]').click(function() {
  //   if ($(this).prop("checked") == true) {
  //     let cryptoIDForGraph = $(this).attr("checkID");
  //     graphCryptoArray.push(cryptoIDForGraph);
  //     if (graphCryptoArray.length == 6) {
  //       alert("cant");
  //       console.log(graphCryptoArray);
  //       $(this).prop("checked", false);
  //     }
  //   }
  //   if ($(this).prop("checked") == false) {
  //     let deleteCryptoIDForGraph = $(this).attr("checkID");
  //     let indexForDelete = graphCryptoArray.findIndex(
  //         x => x === deleteCryptoIDForGraph
  //     );
  //     console.log(indexForDelete);
  //     graphCryptoArray.splice(indexForDelete, 1);
  //   }
  // });
};

getInfoByID = (cryptoID, num, numID,clickDate) => {
  console.log("path 1");
  console.log(requestsArray);
  $.ajax({
    type: "GET",
    datatype: "json",
    url: `https://api.coingecko.com/api/v3/coins/${cryptoID}`,

    success: function(data2) {
      console.log(data2);
      let requestDate = new Date().getTime();
      data2.clickDate = clickDate;
      data2.reqDate = requestDate;
      requestsArray.push(data2);
      console.log(requestsArray);
      localStorage.requestsArray = JSON.stringify(requestsArray);
      printExtraInfo(data2, num, numID);
    },
    error: function(err) {
      console.log("error : ", err);
    }
  });
};

getInfoByIDSecondIf = (cryptoID, num, numID,arrIndex,clickDate) => {
console.log("path 3");
  $.ajax({
    type: "GET",
    datatype: "json",
    url: `https://api.coingecko.com/api/v3/coins/${cryptoID}`,

    success: function(newdata2) {
      console.log(newdata2);


      let requestDate = new Date().getTime();
      newdata2.reqDate = requestDate;
      requestsArray[arrIndex] = newdata2;
      localStorage.requestsArray = JSON.stringify(requestsArray);
      requestsArray[arrIndex].clickDate = clickDate;


      printExtraInfo(newdata2, num, numID);
    },
    error: function(err) {
      console.log("error : ", err);
    }
  });


};



printCrypto = dat => {
  let counter = 100;
  console.log(dat);
  if (localStorage.cryptoArray) {
    dat = JSON.parse(localStorage.cryptoArray);
  } else {
    dat = cryptoArray;
  }
  console.log(dat);
  // console.log(cryptoArray);
  for (i = 0; i < counter; i++) {
    $("#results").append(`
            <div class="card resultCard">
                <div class="card-body">
                        <label class="switch">
                            <input id="${
                              dat[i].symbol
                            }"type="checkbox" class="cryptoCheckbox" checkID="${
      dat[i].symbol
    }"  ${dat[i].checked}>
                                <span class="slider round"></span>
                        </label>
                        <h5 class="card-title">${dat[i].symbol}</h5>
                        <br>
                        <h6 class="card-subtitle mb-2 text-muted">${
                          dat[i].name
                        }</h6>
                        
                        <div class="extraInfo" id="panel${i}"></div>
                        <button type="button" rid="panel${i}" id="button${i}" class="infoButton btn btn-primary" infoid = "${
      dat[i].id
    }" data-toggle="modal" data-target="#exampleModal" > More Info  </button>
                 </div>
            </div>`);
  }

  $(".infoButton").on("click", function() {


    let num = $(this).attr("rid");
    let numID = $(this).attr("id");
    let cryptoID = $(this).attr("infoid");
    $("#" + num).slideDown("slow")

    $("#" + num).append(`<div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            </div>`);


    let clickDate = new Date().getTime();

    let arrIndex = -1;
    if (requestsArray.length>0) {
      console.log("has");
      console.log(cryptoID);
      arrIndex = requestsArray.findIndex(v => {
        return v.id === cryptoID;

      });
      if (arrIndex !== -1) {
        requestsArray[arrIndex].clickDate = clickDate;
      localStorage.requestsArray=JSON.stringify(requestsArray)
      }

    console.log(requestsArray);
      console.log(arrIndex);
    }

    if ( arrIndex === -1) {
      getInfoByID(cryptoID, num, numID,clickDate);
    }

    else if(requestsArray[arrIndex].clickDate - requestsArray[arrIndex].reqDate <= 120000) {
      console.log(requestsArray[arrIndex].clickDate - requestsArray[arrIndex].reqDate);
      console.log("path 2");
      console.log(arrIndex);
      console.log(requestsArray[arrIndex]);
      printExtraInfo(requestsArray[arrIndex],num,numID)

    } else {

      getInfoByIDSecondIf(cryptoID, num, numID,arrIndex,clickDate)

    }







  });











  if (localStorage.graphCryptoArray) {
    graphCryptoArray = JSON.parse(localStorage.graphCryptoArray);
  } else {
    let graphCryptoArray = new Array();
  }

  // $('input[type="checkbox"]').on('change', function(evt) {
  //   if($(this).siblings(':checked').length >= 5) {
  //     this.checked = false;
  //   }
  // });

  $('input[type="checkbox"]').on("change", function() {
    cryptoIDForGraph = $(this).attr("checkID");
    console.log(graphCryptoArray);
    if (graphCryptoArray.length < 6) {
      if ($(this).prop("checked") == true || $(this).attr("checked") == true) {
        cryptoIDForGraph = $(this).attr("checkID");
        graphCryptoArray.push(cryptoIDForGraph);
        localStorage.graphCryptoArray = JSON.stringify(graphCryptoArray);
      }
    }

    if (graphCryptoArray.length == 6) {
      console.log(graphCryptoArray);
      $(this).prop("checked", false);
      graphCryptoArray.splice(6, 1);
      openUpModal(graphCryptoArray);
    }

    // localStorage.graphCryptoArray = JSON.stringify(graphCryptoArray);

    if ($(this).prop("checked") == false || $(this).attr("checked") == false) {
      let deleteCryptoIDForGraph = $(this).attr("checkID");
      graphCryptoArray.forEach(x => {
        if (x.symbol == deleteCryptoIDForGraph) {
          x.checked = "";
        }
      });
      let indexForDelete = graphCryptoArray.findIndex(
        x => x === deleteCryptoIDForGraph
      );
      console.log(indexForDelete);
      console.log(graphCryptoArray);
      graphCryptoArray.splice(indexForDelete, 1);
      console.log(graphCryptoArray);
      localStorage.graphCryptoArray = JSON.stringify(graphCryptoArray);
    }
  });

  // $('input[type="checkbox"]').click(function() {
  //   if ($(this).prop("checked") == true) {
  //     let cryptoIDForGraph = $(this).attr("checkID");
  //     graphCryptoArray.push(cryptoIDForGraph);
  //     console.log(graphCryptoArray.length);
  //
  //     if (graphCryptoArray.length == 6) {
  //       openUpModal(cryptoIDForGraph);
  //       console.log(graphCryptoArray);
  //       $(this).prop("checked", false);
  //     }
  //   }
  //
  //   if ($(this).prop("checked") == false) {
  //     let deleteCryptoIDForGraph = $(this).attr("checkID");
  //     let indexForDelete = graphCryptoArray.findIndex(
  //       x => x === deleteCryptoIDForGraph
  //     );
  //     console.log(indexForDelete);
  //     graphCryptoArray.splice(indexForDelete, 1);
  //   }
  // });

  // for (let cryCoin of graphCryptoArray) {
  //   $(`#${cryCoin}`).attr("checked", "true");
  // }
  console.log(graphCryptoArray);
  //localStorage.graphCryptoArray = JSON.stringify(graphCryptoArray);
  if (localStorage.graphCryptoArray) {
    graphCryptoArray = JSON.parse(localStorage.graphCryptoArray);
  }
  console.log(localStorage.graphCryptoArray);
};

if (!localStorage.requestsArray) {
  requestsArray = [];
  console.log(requestsArray)
}
else {
  requestsArray = JSON.parse(localStorage.requestsArray);
  console.log(requestsArray);
}


getInfo();

// console.log(cryptoArray);
// console.log(graphCryptoArray);
$("#liveReports").click(function() {
  $("#results").html("");
  $("#yTVideo").css("display", "block");
  createGraph(localStorage.graphCryptoArray);
});

$("#homeButton").click(function() {
  $("#results").html("");
  $("#chartContainer").css("display", "none");
  $("#yTVideo").css("display", "show");

  getInfo();
});

$("#searchButton").click(function() {
  $("#results").html("");

  searchInArray();
});

$("#aboutPage").click(function() {
  $("#results").html("");
  $("#chartContainer").css("display", "none");
  $("#yTVideo").css("display", "none");

  showAboutPage();
});
