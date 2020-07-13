$(document).ready(() => {
  $("#login-alert").hide();
  $("#signup-alert").hide();
  updateData();

});

const updateData = () => {
  checkUser();
  hideall();
  getAllManufacturers();
  getAllRetailers();
  getAllDistributers();
  getAllMedicines();
  const user = JSON.parse(localStorage.getItem("user"));
  if(user){
    $('#pagename').html(user.loginType);
  }
  

  setTimeout(() => {
    console.log("manufacturers", manufacturers);
    console.log("retailers", retailers);
    console.log("distributors", distributors);
    console.log("medicines", medicines);
    manufacturers.forEach((x) => {
      manufacturersIds.push(x.loginId);
    });
    distributors.forEach((x) => {
      distributorsIds.push(x.loginId);
    });
    retailers.forEach((x) => {
      retailersIds.push(x.loginId);
    });
    userIds = [].concat.apply(
      [],
      [manufacturersIds, distributorsIds, retailersIds]
    );
    manufacturers.sort((a,b) => a.loginId > b.loginId)
    distributors.sort((a,b) => a.loginId > b.loginId)
    retailers.sort((a,b) => a.loginId > b.loginId)

    if (user && user.loginId) {
      medicines = medicines.filter(
        (x) => x[`${user.loginType.toLowerCase()}Id`] === user.loginId
      );
      medicines.sort((a,b) => a.medicineId > b.medicineId )
      let medicinetable = "";
      medicines.forEach((x, i) => {
        medicinetable +=
          "<tr><td>" +
          (i + 1) +
          "</td><td>" +
          x.medicineId +
          "</td><td>" +
          x.name +
          "</td><td>" +
          x.manufacturerDate +
          "</td><td>" +
          x.expireDate +
          "</td>";
        if (x.distributorId === 0) {
          medicinetable +=
            "<td>" +
            '<button type="button" class="btn btn-primary" data-toggle="modal" onclick="moveToDistributer(\'' +
            x.medicineId +
            "')\">" +
            '<i class="fa fa-fw fa-lg fa-arrow-right"> </span></td>' +
            "</button>";
        }
        if (x.distributorId !== 0 && x.retailerId === 0) {
          medicinetable +=
            "<td>" +
            '<button type="button" class="btn btn-primary" data-toggle="modal" onclick="moveToRetailer(\'' +
            x.medicineId +
            "')\">" +
            '<i class="fa fa-fw fa-lg fa-arrow-right"> </span></td>' +
            "</button>";
        }
        medicinetable += "</tr>";
      });

      $("#medicineslistdiv").empty().html(medicinetable);
      
      let manufacturetable = "";
      manufacturers.forEach((x,i) => {

        manufacturetable +=
          "<tr><td>" +
          (i + 1) +
          "</td><td>" +
          x.loginId +
          "</td><td>" +
          x.name +
          "</td><td>" +
          x.location +
          "</td></tr>";
  
      });
      console.log(manufacturetable);
      $("#manafacturetable").empty().html(manufacturetable);

      let distributortable = "";
      distributors.forEach((x,i) => {

        distributortable +=
          "<tr><td>" +
          (i + 1) +
          "</td><td>" +
          x.loginId +
          "</td><td>" +
          x.name +
          "</td><td>" +
          x.location +
          "</td></tr>";
  
      });
      console.log(distributortable);
      $("#distributortable").empty().html(distributortable);

      let retailertable = "";
      retailers.forEach((x,i) => {

        retailertable +=
          "<tr><td>" +
          (i + 1) +
          "</td><td>" +
          x.loginId +
          "</td><td>" +
          x.name +
          "</td><td>" +
          x.location +
          "</td></tr>";
  
      });
      console.log(retailertable);
      $("#retailertable").empty().html(retailertable);

    

    }

    console.log(userIds);
    $("#login-overlay").hide();
    $(".preload").fadeOut(2000, function () {
      $(".app").fadeIn(1000);
      $("#enrollvoterdiv").show();
    });
  }, 2000);
}

let manufacturers = [];
let medicines = [];
let retailers = [];
let distributors = [];
let loginUsermedicines = [];
let movingId;
let movedistributorId;

let userIds = [];
let manufacturersIds = [];
let distributorsIds = [];
let retailersIds = [];

const checkUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (
    location.pathname !== "/login.html" &&
    location.pathname !== "/signup.html"
  ) {
    if (!user) {
      console.log(user);
      location.href = "login.html";
    } else {
      console.log(user);
      if (user.loginType !== "Manufacturer") {
        $("#enrollcandidate").parent().parent().hide();
      }
    }
  }
};

const resetUserForm = (login) => {
  $("#reg_loginType").val("");
  $("#reg_id").val("");
  $("#reg_name").val("");
  $("#reg_location").val("");
  if (login) {
    showLogin();
  }
};

const register = () => {
  const user = {
    regType: $("#reg_loginType").val(),
    regId: parseInt($("#reg_id").val()),
    regName: $("#reg_name").val(),
    regLocation: $("#reg_location").val(),
  };
  console.log(user.regId, userIds);
  if (userIds.includes(user.regId)) {
    showLoginAlert("signup-alert");
    return false;
  }
  $("#signup-overlay").show();
  switch (user.regType) {
    case "Manufacturer": {
      medicineTraceblity.ManufacturerDetails(
        user.regId,
        user.regName,
        user.regLocation,
        (err, res) => {
          if (err) {
            console.log(err);
            $("#signup-overlay").hide();
          }
          console.log(res);
          resetUserForm(true);
          setTimeout(() => {
            $("#signup-overlay").hide();
          }, 10000);
          getAllManufacturers();
        }
      );
      return;
    }
    case "Distributor": {
      medicineTraceblity.DistributerDetails(
        user.regId,
        user.regName,
        user.regLocation,
        (err, res) => {
          if (err) {
            console.log(err);
            $("#signup-overlay").hide();
          }
          console.log(res);
          resetUserForm(true);
          setTimeout(() => {
            $("#signup-overlay").hide();
          }, 10000);
          getAllDistributers();
        }
      );
      return;
    }
    case "Retailer": {
      medicineTraceblity.RetailerDetails(
        user.regId,
        user.regName,
        user.regLocation,
        (err, res) => {
          if (err) {
            console.log(err);
            $("#signup-overlay").hide();
          }
          console.log(res);
          resetUserForm(true);
          setTimeout(() => {
            $("#signup-overlay").hide();
          }, 10000);
          getAllRetailers();
        }
      );
      return;
    }
  }
};

const moveToDistributer = (medicineId) => {
  if (medicineId === undefined) {
    medicineId = $("#movingdetail").val();
  }
  if (medicineId.split("_").length <= 1) {
    $("#exampleModal").modal();
    let data = "";
    distributors.forEach((x, i) => {
      data +=
        '<option value="' +
        medicineId +
        "_" +
        x.loginId +
        '">' +
        x.name +
        "</option>";
    });
    console.log(data);
    $("#movingdetail").empty().html(data);
  } else {
    let ids = medicineId.split("_");
    medicineId = ids[0];
    let distributorId = ids[1];
    let manufacturerId = JSON.parse(localStorage.getItem("user")).loginId;
    console.log(medicineId, distributorId, manufacturerId);
    $("#exampleModal").modal("toggle");
    medicineTraceblity.MoveToDistributer(
      medicineId,
      distributorId,
      (err, res) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }
};

const moveToRetailer = (medicineId) => {
  if (medicineId === undefined) {
    medicineId = $("#movingretailerdetail").val();
  }
  if (medicineId.split("_").length <= 1) {
    $("#exampleRetailerModal").modal();
    let data = "";
    retailers.forEach((x, i) => {
      data +=
        '<option value="' +
        medicineId +
        "_" +
        x.loginId +
        '">' +
        x.name +
        "</option>";
    });
    console.log(data);
    $("#movingretailerdetail").empty().html(data);
  } else {
    let ids = medicineId.split("_");
    medicineId = ids[0];
    let distributorId = ids[1];
    let manufacturerId = JSON.parse(localStorage.getItem("user")).loginId;
    console.log(medicineId, distributorId, manufacturerId);
    $("#exampleRetailerModal").modal("toggle");
    medicineTraceblity.MoveToRetailer(medicineId, distributorId, (err, res) => {
      if (err) {
        console.log(err);
      }
    });
  }
};

const showLoginAlert = (alertType) => {
  $(`#${alertType}`)
    .fadeTo(2000, 500)
    .slideUp(500, function () {
      $(`#${alertType}`).slideUp(500);
    });
};

const signin = () => {
  console.log("i am herer");
  const loginType = $("#loginType").val();
  const loginId = parseInt($("#login_id").val());

  if (!loginId || !loginType) {
    showLoginAlert();
    return false;
  }

  console.log(loginType, loginId);
  switch (loginType) {
    case "Distributor": {
      let distributor = distributors.filter((x) => x.loginId === loginId);
      if (distributor.length > 0) {
        distributor[0].loginType = loginType;
        localStorage.setItem("user", JSON.stringify(distributor[0]));
        location.href = "/";
      } else {
        showLoginAlert("login-alert");
        $("#login_id").val('');
      }
      return false;
    }
    case "Manufacturer": {
      console.log(manufacturers);
      let manufacturer = manufacturers.filter((x) => x.loginId === loginId);
      if (manufacturer.length > 0) {
        manufacturer[0].loginType = loginType;
        localStorage.setItem("user", JSON.stringify(manufacturer[0]));
        location.href = "/";
      } else {
        showLoginAlert("login-alert");
        $("#login_id").val('');
      }
      return false;
    }
    case "Retailer": {
      let retailer = retailers.filter((x) => x.loginId === loginId);
      
      if (retailer.length > 0) {
        retailer[0].loginType = loginType;
        localStorage.setItem("user", JSON.stringify(retailer[0]));
        location.href = "/";
      } else {
        showLoginAlert("login-alert");
        $("#login_id").val('');
      }
      return false;
    }
    default:
      {
        showLoginAlert("login-alert");
        $("#login_id").val('');
      }
      return false;
  }
};

const logout = () => {
  localStorage.removeItem("user");
  location.href = "/login.html";
};

let hideall = () => {
  $("#enrollcandidatediv").hide();
  $("#enrollvoterdiv").hide();
  $("#manufacturershowdiv").hide();
  $("#votediv").hide();
  $("#getvotecountdiv").hide();
  $("#distributordiv").hide();
  $("#retailerdiv").hide();
  // $("#getcandidatedetailsdiv").hide();
};

let showTarget = (id) => {
  console.log(id);
  hideall();
  $("#" + id + "div").show();
  // switch (id) {
  //   case "getcandidatelist":
  //     getCandidateList();
  //   case "getvoterlist":
  //     getVoterList();
  // }
};

$(".info").click((x) => {
  hideall();
  let divId = x.currentTarget.id;
  $("#" + divId + "div").show();
});

if (typeof web3 !== "undefined") {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

web3.eth.defaultAccount = web3.eth.accounts[0];

var medicineTraceblityContract = web3.eth.contract([
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "_DistributerId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_DistributerName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_DistributerLocation",
        type: "string",
      },
    ],
    name: "DistributerDetails",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "_ManufacturerId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_ManufacturerName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_ManufacturerLocation",
        type: "string",
      },
    ],
    name: "ManufacturerDetails",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "_MedicineId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_DistributerId",
        type: "uint256",
      },
    ],
    name: "MoveToDistributer",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "_MedicineId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_MedicineName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_ExpairyDate",
        type: "string",
      },
      {
        internalType: "string",
        name: "_ManfacturerDate",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_ManufacturerId",
        type: "uint256",
      },
    ],
    name: "MoveToManufacturer",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "_MedicineId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_RetailerId",
        type: "uint256",
      },
    ],
    name: "MoveToRetailer",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "_RetailerId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_RetailerName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_RetailerLocation",
        type: "string",
      },
    ],
    name: "RetailerDetails",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "GetAllDistributer",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "GetAllManufacturer",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "GetAllMedicines",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "GetAllRetailer",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "_DistributerId",
        type: "uint256",
      },
    ],
    name: "GetDistributerDetails",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "_MedicineId",
        type: "uint256",
      },
    ],
    name: "GetInHandoff",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "_ManufacturerId",
        type: "uint256",
      },
    ],
    name: "GetManufacturerDetails",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "_MedicineId",
        type: "uint256",
      },
    ],
    name: "GetMedicineDetails",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "_RetailerId",
        type: "uint256",
      },
    ],
    name: "GetRetailerDetails",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
]);
var medicineTraceblity = medicineTraceblityContract.at(
  "0x30168a067dac09817a948716723629aaa076a915"
);

const getAllManufacturers = async () => {
  manufacturers = [];
  medicineTraceblity.GetAllManufacturer(function (error, result) {
    result.forEach((id) => {
      medicineTraceblity.GetManufacturerDetails(id, function (error, result) {
        if (!error) {
          console.log(result[0] + result[1] + result[2]);
          manufacturers.push({
            loginId: result[0]["c"][0], //[],
            name: result[1],
            location: result[2],
          });
        } else console.log(error);
      });
    });
  });
};

const getAllRetailers = () => {
  retailers = [];
  medicineTraceblity.GetAllRetailer(function (error, result) {
    // if (!error) {
    result.forEach((id) => {
      medicineTraceblity.GetRetailerDetails(id, function (error, result) {
        if (!error) {
          console.log(result[0] + result[1] + result[2]);
          retailers.push({
            loginId: result[0]["c"][0],
            name: result[1],
            location: result[2],
          });
        } else console.log(error);
      });
    });
  });
};

const getAllDistributers = () => {
  distributors = [];
  medicineTraceblity.GetAllDistributer(function (error, result) {
    result.forEach((id) => {
      medicineTraceblity.GetDistributerDetails(id, function (error, result) {
        if (!error) {
          console.log(result[0] + result[1] + result[2]);
          distributors.push({
            loginId: result[0]["c"][0],
            name: result[1],
            location: result[2],
          });
        } else console.log(error);
      });
    });
  });
};

const getAllMedicines = () => {
  medicines = [];
  medicineTraceblity.GetAllMedicines(function (error, result) {
    result.forEach((id) => {
      medicineTraceblity.GetMedicineDetails(id, function (error, result) {
        if (!error) {
          console.log(result, result[0] + result[1] + result[2]);
          medicines.push({
            medicineId: result[0]["c"][0],
            name: result[1],
            manufacturerId: result[2]["c"][0],
            distributorId: result[3]["c"][0],
            retailerId: result[4]["c"][0],
            manufacturerDate: result[5],
            expireDate: result[6],
          });
        } else console.log(error);
      });
    });
  });
};

const updateUI = (value) => {
  $(".app").hide();
  $(".preload").show();
  let timeout = value === undefined ? 15000 : 2000
  $(".preload").fadeOut(timeout, function () {
    updateData();
    $(".app").fadeIn(500);
  });
};

$("#button_enrollCandidate").click(function () {
  // $(".spinner").show();
  console.log(
    $("#en_MedicineId").val(),
    $("#en_MedicineName").val(),
    $("#en_mandate").val(),
    $("#en_expdate").val()
  );
  let manufacturerId = JSON.parse(localStorage.getItem("user")).loginId;
  let medicineId = $("#en_MedicineId").val();
  medicineTraceblity.MoveToManufacturer(
    $("#en_MedicineId").val(),
    $("#en_MedicineName").val(),
    $("#en_mandate").val(),
    $("#en_expdate").val(),
    manufacturerId,
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
        $("#en_MedicineId").val("");
        $("#en_MedicineName").val("");
        $("#en_mandate").val("");
        $("#en_expdate").val("");
        updateUI();
      }
    }
  );
});

var getmedicine = () => {
  console.log("in Mediene Details", $("#gvc_CandiadteId").val());

  medicineTraceblity.GetInHandoff($("#gvc_CandiadteId").val(), function (
    error,
    result
  ) {
    if (!error) {
      if (retailersIds.includes(result.c[0])) {
        let retailerObj = retailers.filter(x => x.loginId === result.c[0])[0]
        let medinfo = "<td>"+ 1 +"</td><td>"+ retailerObj.loginId +"</td><td>"+ retailerObj.name+"</td><td>"+ retailerObj.location+"</td><td>Retailer</td>"
        $("#medinfo").empty().html(medinfo);
      } else if (manufacturersIds.includes(result.c[0])) {
        let manufactureObj = manufacturers.filter(x => x.loginId === result.c[0])[0]
        let medinfo = "<td>"+ 1 +"</td><td>"+ manufactureObj.loginId +"</td><td>"+ manufactureObj.name+"</td><td>"+ manufactureObj.location+"</td><td>Manufacturer</td>"
        $("#medinfo").empty().html(medinfo);
      } else if (distributorsIds.includes(result.c[0])) {
        let distributorObj = distributors.filter(x => x.loginId === result.c[0])[0]
        let medinfo = "<td>"+ 1 +"</td><td>"+ distributorObj.loginId +"</td><td>"+ distributorObj.name+"</td><td>"+ distributorObj.location+"</td><td>Distributor</td>"
        $("#medinfo").empty().html(medinfo);
      } else {
        $("#medinfo").empty().html("<td>Not Found</td>");
      }

      console.log(result);
    } else console.log(error);
  });
};

var processVote = () => {
  Vote.vote(
    $("#vote_CandiadteId").val(),
    $("#vote_VoterId").val(),
    (err, res) => {
      if (res) {
        $(".spinner").hide();
        $("#vote_CandiadteId").val("");
        $("#vote_VoterId").val("");
        console.log(res);
      }
      if (err) {
        console.log(err);
        $(".spinner").hide();
      }
    }
  );
};

let getVoterList = () => {
  Vote.getVoterList(function (error, result) {
    $("#listvoters").empty();
    $("#listvoters").append(
      '<a class="list-group-item list-group-item-action active" href="#" >List Of Voters</a>'
    );
    if (!error) {
      for (i = 0; i < result.length; i++) {
        $("#listvoters").append(
          '<a class="list-group-item list-group-item-action" href="#" >' +
            result[i] +
            "</a>"
        );
        // console.log(result[i]);
      }
    } else console.log(error);
  });
};

let getCandidateList = () => {
  Vote.getCandidateList(function (error, result) {
    $("#listcandidates").empty();
    $("#listcandidates").append(
      '<a class="list-group-item list-group-item-action active" href="#" >List Of Candidates</a>'
    );
    if (!error) {
      for (i = 0; i < result.length; i++) {
        $("#listcandidates").append(
          '<a class="list-group-item list-group-item-action" href="#" >' +
            result[i] +
            "</a>"
        );
        console.log(result[i]);
      }
    } else console.log(error);
  });
};
