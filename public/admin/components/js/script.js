console.log('test3');

var data = {
  // A labels array that can contain any sort of values
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Saturday', 'Sunday'],
  // Our series array that contains series objects or in this case series data arrays
  series: [
    [20,40,120,80,100,150,600]
  ]
};

new Chartist.Line('.ct-chart', data);