function getOrbit() {
  const modelViewer = document.querySelector("#sampleChair");
  console.log(`recordOrbit ${modelViewer.getCameraOrbit()}`);
}

function setOrbit(orbit) {
  const modelViewer = document.querySelector("#sampleChair");
  modelViewer.cameraOrbit = orbit;
  console.log("setOrbit");
}

function toggleDimensions(element) {
  if (setToggele) {
    element.classList.remove("hide");
  } else {
    element.classList.add("hide");
  }
}

// function saveViewport() {
//   console.log("working");

//   var canvas = document.createElement("canvas");
//   var context = canvas.getContext("2d");

//   canvas.width = 4000;
//   canvas.height = 4000;

//   modelViewer.captureStream().getVideoTracks()[0].onended = function () {
//     context.drawImage(this, 0, 0, canvas.width, canvas.height);
//     var image = canvas.toDataURL("image/png");
//     var link = document.createElement("a");
//     link.href = image;
//     link.download = "viewport.png";
//     link.click();
//   };
// }

var setToggele = false;
const modelViewer = document.querySelector("#sampleChair");
const downloadBtn = document.querySelector("#downloadBtn");
const selectSKU = document.querySelector("#selectSKU");
const selectAng = document.querySelector("#selectAng");
const showDimensions = document.querySelector("#dimensions");

selectSKU.addEventListener("change", function () {
  // const selectedOption = selectSKU.options[selectSKU.selectedIndex];
  const selectedOption = selectSKU.selectedIndex;
  console.log(selectedOption);
  modelViewer.setAttribute("src", `./assets/models/sku${selectedOption}.glb`);
});

selectAng.addEventListener("change", function () {
  // const selectedOption = selectSKU.options[selectSKU.selectedIndex];
  const selectedOption = selectAng.selectedIndex;
  switch (selectedOption) {
    case 1:
      setOrbit(
        "-1.6257007718062553rad 1.5167256465734933rad 2.6057311612773844m"
      );
      break;
    case 2:
      setOrbit(
        "-0.601044907424918rad 1.4558758591928653rad 2.6057311612773844m"
      );
      break;
    case 3:
      setOrbit(
        "-3.1459499249539977rad 1.5530041353910717rad 2.6057311612773844m"
      );
      break;
    case 4:
      setOrbit(
        "-2.523576814833617rad 1.5550817747170542rad 2.6057311612773844m"
      );
      break;

    default:
      console.log("Invalid selection");
  }
});

downloadBtn.addEventListener("click", () => {
  modelViewer
    .toBlob({ mimeType: "image/jpeg", qualityArgument: 0.9, idealAspect: 1 })
    .then((blob) => {
      // Create a new image element
      const img = new Image();

      img.onload = () => {
        // Create a canvas element with the desired dimensions
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxSize = 4000;

        // Set the canvas size and fill it with white background
        canvas.width = maxSize;
        canvas.height = maxSize;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, maxSize, maxSize);

        // Determine the dimensions for cropping and resizing
        let width = img.width;
        let height = img.height;
        let offsetX = 0;
        let offsetY = 0;

        if (width > height) {
          offsetX = (width - height) / 2;
          width = height;
        } else {
          offsetY = (height - width) / 2;
          height = width;
        }

        // Draw the cropped and resized image on the canvas
        ctx.drawImage(
          img,
          offsetX,
          offsetY,
          width,
          height,
          0,
          0,
          maxSize,
          maxSize
        );

        // Convert the canvas content to blob
        canvas.toBlob(
          (resizedBlob) => {
            // Create a download link for the cropped and resized image
            const url = URL.createObjectURL(resizedBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "image.jpeg";
            link.click();
          },
          "image/jpeg",
          1
        );
      };

      img.src = URL.createObjectURL(blob);
    });
});

// downloadBtn.addEventListener("click", () => {
//   modelViewer
//     .toBlob({ mimeType: "image/jpeg", qualityArgument: 1, idealAspect: 1, back })
//     .then((blob) => {
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = "image.jpeg";
//       link.click();
//     });
// });

// downloadBtn.addEventListener("click", saveViewport);

showDimensions.addEventListener("click", () => {
  setToggele = !setToggele;
  toggleDimensions(modelViewer.querySelector("#dimLines"));
  modelViewer.querySelectorAll("button").forEach((hotspot) => {
    toggleDimensions(hotspot);
  });
});

//show dimensins starting
function drawLine(svgLine, dotHotspot1, dotHotspot2, dimensionHotspot) {
  if (dotHotspot1 && dotHotspot2) {
    svgLine.setAttribute("x1", dotHotspot1.canvasPosition.x);
    svgLine.setAttribute("y1", dotHotspot1.canvasPosition.y);
    svgLine.setAttribute("x2", dotHotspot2.canvasPosition.x);
    svgLine.setAttribute("y2", dotHotspot2.canvasPosition.y);

    // use provided optional hotspot to tie visibility of this svg line to
    if (dimensionHotspot && !dimensionHotspot.facingCamera) {
      svgLine.classList.add("hide");
    } else {
      svgLine.classList.remove("hide");
    }
  }
}

const dimLines = modelViewer.querySelectorAll("line");

const renderSVG = () => {
  drawLine(
    dimLines[0],
    modelViewer.queryHotspot("hotspot-dot+X-Y+Z"),
    modelViewer.queryHotspot("hotspot-dot+X-Y-Z"),
    modelViewer.queryHotspot("hotspot-dim+X-Y")
  );
  drawLine(
    dimLines[1],
    modelViewer.queryHotspot("hotspot-dot+X-Y-Z"),
    modelViewer.queryHotspot("hotspot-dot+X+Y-Z"),
    modelViewer.queryHotspot("hotspot-dim+X-Z")
  );
  drawLine(
    dimLines[2],
    modelViewer.queryHotspot("hotspot-dot+X+Y-Z"),
    modelViewer.queryHotspot("hotspot-dot-X+Y-Z")
  ); // always visible
  drawLine(
    dimLines[3],
    modelViewer.queryHotspot("hotspot-dot-X+Y-Z"),
    modelViewer.queryHotspot("hotspot-dot-X-Y-Z"),
    modelViewer.queryHotspot("hotspot-dim-X-Z")
  );
  drawLine(
    dimLines[4],
    modelViewer.queryHotspot("hotspot-dot-X-Y-Z"),
    modelViewer.queryHotspot("hotspot-dot-X-Y+Z"),
    modelViewer.queryHotspot("hotspot-dim-X-Y")
  );
};

modelViewer.addEventListener("camera-change", renderSVG);

modelViewer.addEventListener("load", () => {
  const center = modelViewer.getBoundingBoxCenter();
  const size = modelViewer.getDimensions();
  const x2 = size.x / 2;
  const y2 = size.y / 2;
  const z2 = size.z / 2;

  modelViewer.updateHotspot({
    name: "hotspot-dot+X-Y+Z",
    position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`,
  });

  modelViewer.updateHotspot({
    name: "hotspot-dim+X-Y",
    position: `${center.x + x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`,
  });
  modelViewer.querySelector('button[slot="hotspot-dim+X-Y"]').textContent = `${(
    size.z * 100
  ).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: "hotspot-dot+X-Y-Z",
    position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`,
  });

  modelViewer.updateHotspot({
    name: "hotspot-dim+X-Z",
    position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`,
  });
  modelViewer.querySelector('button[slot="hotspot-dim+X-Z"]').textContent = `${(
    size.y * 100
  ).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: "hotspot-dot+X+Y-Z",
    position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`,
  });

  modelViewer.updateHotspot({
    name: "hotspot-dim+Y-Z",
    position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`,
  });
  modelViewer.querySelector('button[slot="hotspot-dim+Y-Z"]').textContent = `${(
    size.x * 100
  ).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: "hotspot-dot-X+Y-Z",
    position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`,
  });

  modelViewer.updateHotspot({
    name: "hotspot-dim-X-Z",
    position: `${center.x - x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`,
  });
  modelViewer.querySelector('button[slot="hotspot-dim-X-Z"]').textContent = `${(
    size.y * 100
  ).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: "hotspot-dot-X-Y-Z",
    position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`,
  });

  modelViewer.updateHotspot({
    name: "hotspot-dim-X-Y",
    position: `${center.x - x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`,
  });
  modelViewer.querySelector('button[slot="hotspot-dim-X-Y"]').textContent = `${(
    size.z * 100
  ).toFixed(0)} cm`;

  modelViewer.updateHotspot({
    name: "hotspot-dot-X-Y+Z",
    position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`,
  });

  // renderSVG();

  toggleDimensions(modelViewer.querySelector("#dimLines"));
  modelViewer.querySelectorAll("button").forEach((hotspot) => {
    toggleDimensions(hotspot);
  });
});
