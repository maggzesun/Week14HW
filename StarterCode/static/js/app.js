sample_json = d3.json('samples.json');
console.log(sample_json)

sample_json.then(function(data) {
  ids = data.samples.map(function(value) {
    d3.select("#selDataset").append("option").text(value.id);
    return value.id;
  });

  otu_ids = data.samples.map(function(value) {
    strotu_ids = value.otu_ids.map(function(c){return `OTU ${c.toString()}`});
    return strotu_ids.slice(0,9);
  });

  otu_ids_int = data.samples.map(function(value) {
    return value.otu_ids.slice(0,9);
  });

  otu_labels = data.samples.map(function(value) {
    return value.otu_labels.slice(0,9);
  });

  sample_values = data.samples.map(function(value) {
    return value.sample_values.slice(0,9);
  });

  //Returning demographic data
  demographics_ids = data.metadata.map(function(person) {
    return person.id;
  });

  demographics_ethnicity = data.metadata.map(function(person) {
    return person.ethnicity;
  });

  demographics_gender = data.metadata.map(function(person) {
    return person.gender;
  });

  demographics_age = data.metadata.map(function(person) {
    return person.age;
  });

  demographics_location = data.metadata.map(function(person) {
    return person.location;
  });

  demographics_bbtype = data.metadata.map(function(person) {
      return person.bbtype;
  });

    demographics_wfreq = data.metadata.map(function(person) {
    return person.wfreq;
  });

  // Initializes the page with a default plot
  function init() {
    //Demographic text
    d3.select("#demo_id").text(`ID: ${demographics_ids[0]}`);
    d3.select("#demo_ethnicity").text(`Ethnicity: ${demographics_ethnicity[0]}`);
    d3.select("#demo_gender").text(`Gender: ${demographics_gender[0]}`);
    d3.select("#demo_age").text(`Age: ${demographics_age[0]}`);
    d3.select("#demo_location").text(`Location: ${demographics_location[0]}`);
    d3.select("#demo_bbtype").text(`BBType: ${demographics_bbtype[0]}`);
    d3.select("#demo_wfreq").text(`WFreq: ${demographics_wfreq[0]}`);

    //Bar Graph
    var data_bar = [{
      x: sample_values[0],
      y: otu_ids[0],
      type: 'bar',
      orientation: 'h',
      text: otu_labels[0]
    }];

    Plotly.newPlot("bar", data_bar);

    //Bubble Chart
    var data_bubble = [{
      x: otu_ids_int[0],
      y: sample_values[0],
      mode: 'markers',
      marker: {
        color: otu_ids_int[0], 
        colorscale: 'Rainbow', 
        size: sample_values[0]
      },
      text: otu_labels[0]
    }];

    let layout = {
      xaxis: {
        title: 'OTU ID'
      }
    };

    Plotly.newPlot("bubble", data_bubble, layout);


  }

  // On change to the DOM, call getData()
  d3.selectAll("#selDataset").on("change", getData);

  function getData() {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");
  
    // Initialize x and y arrays

    var x_int = [];
    var x = [];
    var y = [];
    var text = [];
    var data_bar = [];
    var data_bubble = [];

    for (let step = 0; step < ids.length; step++) {
      if (dataset === ids[step]) {
        x_int = otu_ids_int[step];
        x = otu_ids[step]
        y = sample_values[step];
        text = otu_labels[step];

        //Demographic text
        d3.select("#demo_id").text(`ID: ${demographics_ids[step]}`);
        d3.select("#demo_ethnicity").text(`Ethnicity: ${demographics_ethnicity[step]}`);
        d3.select("#demo_gender").text(`Gender: ${demographics_gender[step]}`);
        d3.select("#demo_age").text(`Age: ${demographics_age[step]}`);
        d3.select("#demo_location").text(`Location: ${demographics_location[step]}`);
        d3.select("#demo_bbtype").text(`BBType: ${demographics_bbtype[step]}`);
        d3.select("#demo_wfreq").text(`WFreq: ${demographics_wfreq[step]}`);

        //Update Bar Graph
        data_bar = [{
          x: y,
          y: x,
          type: 'bar',
          orientation: 'h',
          text: text
        }];

        //Update Bubble Chart
        data_bubble = [{
          x: x_int,
          y: y,
          mode: 'markers',
          marker: {
            color: x_int, 
            colorscale: 'Rainbow',
            size: y
          },
          text: text
        }];

        layout = {
          xaxis: {
            title: 'OTU ID'
          }
        };

      }
    }
  // Call functions to update the charts
    updateBarPlotly(data_bar);
    updateBubblePlotly(data_bubble, layout);
  }

// Update the bar plot's values
  function updateBarPlotly(newdata_bar) {
    Plotly.newPlot("bar", newdata_bar);
  }

// Update the bubble plot's values
  function updateBubblePlotly(newdata_bubble, layout) {
    Plotly.newPlot("bubble", newdata_bubble, layout);
  }
  
  init();

});

