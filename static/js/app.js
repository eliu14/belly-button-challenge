// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sample_object = metadata.filter((object) => {
      return object.id == sample;
    })[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select(`#sample-metadata`);

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (const [key, value] of Object.entries(sample_object)){
      let pg = panel.append("p");
      pg.text(`${key.toUpperCase()}: ${value}`)
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((bar_data) => {

    // Get the samples field
    let samples = bar_data.samples;
    
    // Filter the samples for the object with the desired sample number
    let sample_object = samples.filter((object) => {
      return object.id == sample;
    })[0];
    console.log(`${sample_object.id}`);
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sample_object.otu_ids;
    let otu_labels = sample_object.otu_labels;
    let sample_values = sample_object.sample_values;

    // Build a Bubble Chart
    var bubble_data = [{
      mode: 'markers',
      x: otu_ids,
      y: sample_values,
      marker: {
        color: otu_ids,
        size: sample_values,
      },
      text: otu_labels
    }];
    
    var bubble_layout = {
      title:{
        text: 'Bacteria Cultures Per Sample'
      }
    };
    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubble_data, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.map(function(value) {
      return `OTU ${value}`;
    }).reverse().slice(-10);
    let xticks = sample_values.reverse().slice(-10);
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    var bar_data = [
      {
        type: 'bar',
        x: xticks,
        y: yticks,
        orientation: 'h',
        text: otu_labels.reverse().slice(-10)
      }
    ]
    var bar_layout ={
      title: {
        text: "Top 10 Bacteria Cultures Found"
      }
    }
    // Render the Bar Chart
    Plotly.newPlot('bar', bar_data, bar_layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropDownMenu = d3.select("#selDataset")

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for(let i =0; i < names.length; i++){
      let sample_name = names[i];
      let option = dropDownMenu.append("option");
      option.property("value", sample_name)
      option.text(sample_name)
    }

    // Get the first sample from the list
    let sample = dropDownMenu.property("value");

    // Build charts and metadata panel with the first sample
    buildCharts(sample);
    buildMetadata(sample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
