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

var setToggele = false;
const modelViewer = document.querySelector("#sampleChair");
const threeFourthBt = document.querySelector("#threeFourthButton");
const sideButton = document.querySelector("#sideButton");
const downloadBtn = document.querySelector("#downloadBtn");
const swapTexture = document.querySelector("#swapTexture");
const showDimensions = document.querySelector("#dimensions");

downloadBtn.addEventListener("click", () => {
  modelViewer
    .toBlob({ mimeType: "image/jpeg", qualityArgument: 1, idealAspect: 1 })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "image.jpeg";
      link.click();
    });
});

modelViewer.variantName = "Default"; //setting default texture

showDimensions.addEventListener("click", () => {
  toggleDimensions(modelViewer.querySelector("#dimLines"));
  modelViewer.querySelectorAll("button").forEach((hotspot) => {
    toggleDimensions(hotspot);
  });
  setToggele = !setToggele;
});

swapTexture.addEventListener("click", () => {
  // const optionsMat = modelViewer.availableVariants;
  // console.log(optionsMat);
  if (modelViewer.variantName == "Default") {
    modelViewer.variantName = "lemmon";
  } else {
    modelViewer.variantName = "Default";
  }
});

sideButton.addEventListener("click", function () {
  setOrbit("-1.6257007718062553rad 1.5167256465734933rad 2.6057311612773844m");
});

threeFourthBt.addEventListener("click", function () {
  setOrbit("-0.7666212192646024rad 1.2728704618963735rad 2.6057311612773844m");
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

  renderSVG();
});

toggleDimensions(modelViewer.querySelector("#dimLines"));
modelViewer.querySelectorAll("button").forEach((hotspot) => {
  toggleDimensions(hotspot);
});

setToggele != setToggele;
