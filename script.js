'use strict';

Object.prototype.draw = function(){


  function zeroAxisDraw(limits, scale) {
      ctx.font = '10px Arial';
      ctx.strokeStyle = 'grey';
      ctx.fillStyle = 'grey';
      ctx.lineWidth = 0.5;
      let y = false,
          x = false;
      // Y
      if (limits.minX < 0 && limits.maxX > 0) {
          y = true;
          ctx.beginPath();
          ctx.moveTo(margin.left + Math.abs(limits.minX) * scale.x, margin.top);
          ctx.lineTo(margin.left + Math.abs(limits.minX) * scale.x, canvas.height - margin.bottom);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(margin.left + Math.abs(limits.minX) * scale.x, margin.top);
          ctx.lineTo(margin.left + Math.abs(limits.minX) * scale.x - 5,margin.top + 5);
          ctx.lineTo(margin.left + Math.abs(limits.minX) * scale.x + 5,margin.top + 5);
          ctx.fill();
          ctx.fillText('y', margin.left + Math.abs(limits.minX) * scale.x + 5, margin.top);
      }
      // X
      if (limits.minY < 0 && limits.maxY > 0) {
          x = true;
          ctx.beginPath();
          ctx.moveTo(margin.left, margin.top + limits.maxY * scale.y);
          ctx.lineTo(canvas.width - margin.right, margin.top + limits.maxY * scale.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(canvas.width - margin.right,margin.top + limits.maxY * scale.y);
          ctx.lineTo(canvas.width - margin.right - 5,
              margin.top + limits.maxY * scale.y - 5);
          ctx.lineTo(canvas.width - margin.right - 5,
              margin.top + limits.maxY * scale.y + 5);
          ctx.fill();
          ctx.fillText('x', canvas.width - margin.right - 5, margin.top + limits.maxY * scale.y - 7);
      }
      if (x && y) ctx.fillText('0', margin.left + Math.abs(limits.minX) * scale.x - 7,
          margin.top + limits.maxY * scale.y + 10);
  }

  function leftAxisDraw(data, scale) {
      ctx.font = '10px Arial';
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(margin.left - 8, canvas.height - margin.bottom);
      ctx.lineTo(margin.left - 8, margin.top);
      ctx.stroke();
      if (!data.isUnique) {
          let drawn = [];
          for (let y = canvas.height - margin.bottom; y >= margin.top; y -= 25) {
              let value = data.minY + Math.floor((canvas.height - margin.bottom - y) / scale.y);
              if (drawn.indexOf(value) === -1) {
                  let valueY = canvas.height - margin.bottom - Math.floor((value - data.minY) * scale.y);
                  ctx.fillText(value, 5, valueY + 5);
                  ctx.beginPath();
                  ctx.moveTo(margin.left - 11, valueY);
                  ctx.lineTo(margin.left - 5, valueY);
                  ctx.stroke();
                  drawn.push(value);
              }
          }
      } else {
          for (let i = 0; i < data.uniqueData.length; i++) {
              ctx.fillText(data.uniqueData[i], 5, canvas.height - margin.bottom - i * data.distance + 5);
              ctx.beginPath();
              ctx.moveTo(margin.left - 6, canvas.height - margin.bottom - i * data.distance);
              ctx.lineTo(margin.left, canvas.height - margin.bottom - i * data.distance);
              ctx.stroke();
          }
      }
  }

  function bottomAxisDraw(data, scale) {
      ctx.font = '10px Arial';
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'black';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(margin.left, canvas.height - margin.bottom + 6);
      ctx.lineTo(canvas.width - margin.right, canvas.height - margin.bottom + 6);
      ctx.stroke();
      if (!data.isUnique) {
          let drawn = [];
          for (let x = margin.left; x <= canvas.width - margin.right; x += 45) {
              let value = data.minX + Math.floor((x - margin.left) / scale.x);
              if (drawn.indexOf(value) === -1) {
                  let valueX = margin.left + Math.floor((value - data.minX) * scale.x);
                  ctx.fillText(value, valueX - 10, canvas.height - 10);
                  ctx.beginPath();
                  ctx.moveTo(valueX, canvas.height - margin.bottom + 11);
                  ctx.lineTo(valueX, canvas.height - margin.bottom + 6);
                  ctx.stroke();
                  drawn.push(value);
              }
          }
      } else {
          for (let i = 0; i < data.uniqueData.length; i++) {
              ctx.fillText(data.uniqueData[i], margin.left + i * data.distance- 10, canvas.height - 10);
              ctx.beginPath();
              ctx.moveTo(margin.left + i * data.distance, canvas.height - margin.bottom + 11);
              ctx.lineTo(margin.left + i * data.distance, canvas.height - margin.bottom + 6);
              ctx.stroke();
          }
      }
  }


  function barDraw(x, y, w, h, color) {
      ctx.clearRect(x, y, w, h);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }

  function arcDraw(x, y, r, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r,0,360);
      ctx.fill();
  }

  function lineDraw(last, current, color) {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(current.x, current.y);
      ctx.stroke();
  }


  // histogram
  function histogramCombine(arr) {
      let result = {};

      for (let i = 0; i < arr.length; i++) {
          if (result[arr[i].toString()]) result[arr[i].toString()]++;
          else result[arr[i].toString()] = 1;
      }
      return result;
  }

  function histogramMinAndMax(obj) {
      let maxY = null;

      for (let i in obj) {
          if (typeof obj[i] !== 'object' && typeof obj[i] !== 'function'){
              if (!maxY) maxY = obj[i];
              else if (obj[i] > maxY) maxY = obj[i];
          }
      }
      return {minY: 0, maxY: maxY};
  }

  function histogramBarRedraw(e) {
      let rect = canvas.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top,
          bar  = -1,
          figures = canvas.figureLocation;

      if (x > margin.left && x < canvas.width - margin.right && y > margin.top && y < canvas.height - margin.bottom) {
          bar = Math.floor((x - margin.left) / canvas.distanceX);
          if (y < figures[bar].y) {
              bar = -1;
          }
          if (bar === -1) {
              if (canvas.focusedBar >= 0) {
                  canvas.removeAttribute('title');
                  barDraw(figures[canvas.focusedBar].x, figures[canvas.focusedBar].y,
                      figures[canvas.focusedBar].w, figures[canvas.focusedBar].h, colorsRGBA[canvas.focusedBar % colorsRGBA.length] + '0.5)');
              }
              canvas.focusedBar = -1;
          }
          if (bar !== -1 && bar !== canvas.focusedBar) {
              if (canvas.focusedBar >= 0) {
                  barDraw(figures[canvas.focusedBar].x, figures[canvas.focusedBar].y,
                      figures[canvas.focusedBar].w, figures[canvas.focusedBar].h, colorsRGBA[canvas.focusedBar % colorsRGBA.length] + '0.5)');
              }

              barDraw(figures[bar].x + 1, figures[bar].y, figures[bar].w - 2, figures[bar].h, colorsRGBA[bar % colorsRGBA.length] + '1)');
              canvas.setAttribute('title', 'name: ' + figures[bar].name + '\nvalue: ' + figures[bar].value);
              canvas.focusedBar = bar;
          }
      } else {
          if (canvas.focusedBar >= 0) {
              canvas.removeAttribute('title');
              barDraw(figures[canvas.focusedBar].x, figures[canvas.focusedBar].y,
                  figures[canvas.focusedBar].w, figures[canvas.focusedBar].h, colorsRGBA[canvas.focusedBar % colorsRGBA.length] + '0.5)');
              canvas.focusedBar = -1;
          }
      }
  }

  function histogramDraw() {
      if (canvas.focusedBar >= 0) {
          canvas.removeAttribute('title');
          let figures = canvas.figureLocation;
          barDraw(figures[canvas.focusedBar].x, figures[canvas.focusedBar].y,
              figures[canvas.focusedBar].w, figures[canvas.focusedBar].h, colorsRGBA[canvas.focusedBar % colorsRGBA.length] + '0.5)');
          canvas.focusedBar = -1;
      }
  }

  function simpleHistogram() {
        canvas.className = 'histogram';
        canvas.figureLocation =  [];

        let combinedData = histogramCombine(data),
            maxes = histogramMinAndMax(combinedData),
            plotDistance = Math.floor((canvas.width  - margin.left - margin.right) / Object.keys(combinedData).length),
            scale = {
                y: Math.floor((canvas.height - margin.top - margin.bottom) / maxes.maxY),
            };

        canvas.distanceX = plotDistance;

        leftAxisDraw(maxes, scale);

        let count = 0;
        for (let cursor in combinedData) {
            if (typeof combinedData[cursor] !== 'object' && typeof combinedData[cursor] !== 'function') {
                let paramsBar = {
                    x: margin.left + plotDistance * count + 1,
                    y: canvas.height - margin.bottom - combinedData[cursor] * scale.y,
                    w: plotDistance - 2,
                    h: combinedData[cursor] * scale.y,
                    color: colorsRGBA[count % colorsRGBA.length] + '0.5)',
                    name: cursor,
                    value: combinedData[cursor]
                };
                barDraw(paramsBar.x, paramsBar.y, paramsBar.w, paramsBar.h, paramsBar.color);
                ctx.fillStyle = 'black';
                ctx.font = '20px Arial';
                ctx.fillText(cursor, paramsBar.x + paramsBar.w / 2, canvas.height - margin.bottom + 20);
                canvas.figureLocation.push(paramsBar);
                count++;
            }
        }
    }


  // scatter plot
  function scatterMinAndMax(arr) {
      let maxX = arr[0].x,
          maxY = arr[0].y,
          minX = arr[0].x,
          minY = arr[0].y;

      for (let i = 0; i < arr.length; i++) {
          if (arr[i].x + arr[i].r > maxX) maxX = arr[i].x + arr[i].r ;
          if (arr[i].y + arr[i].r  > maxY) maxY = arr[i].y + arr[i].r ;
      }

      for (let i = 0; i < arr.length; i++) {
          if (arr[i].x - arr[i].r  < minX) minX = arr[i].x - arr[i].r ;
          if (arr[i].y - arr[i].r  < minY) minY = arr[i].y - arr[i].r ;
      }

      return {maxX: maxX + 10, maxY: maxY + 10, minX: minX - 10, minY: minY - 10};
  }

  function scatterChart() {
      canvas.className = 'scatter plot';
      canvas.figureLocation =  [];
      let limits = scatterMinAndMax(data),
          s = (canvas.width - margin.left - margin.right) / (limits.maxX - limits.minX);

      if ((canvas.height - margin.top - margin.bottom) / Math.abs(limits.maxY - limits.minY) < s)
          s = (canvas.height - margin.top - margin.bottom) / Math.abs(limits.maxY - limits.minY);

      let scale = {
          x: s,
          y: s
      };
      canvas.limits = limits;
      canvas.scale = scale;

      leftAxisDraw(limits, scale);
      bottomAxisDraw(limits, scale);
      zeroAxisDraw(limits, scale);

      for (let i = 0; i < data.length; i++) {
          let paramArc = {
              x: margin.left + (data[i].x - limits.minX) * scale.x,
              y: canvas.height - margin.bottom - (data[i].y - limits.minY) * scale.y,
              r: data[i].r * scale.x,
              color: 'rgba(20, 200, 36, 0.4)'
          };
          arcDraw(paramArc.x, paramArc.y, paramArc.r, paramArc.color);
          canvas.figureLocation.push(paramArc);
      }
  }

  function scatterRedraw(e) {
      let rect = canvas.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;

      let figures = canvas.figureLocation,
          scale = canvas.scale,
          limits = canvas.limits;

      let objects = [],
          distForObjects = [],
          index = [];
      for (let i = 0; i < figures.length; i++) {
          let dist = Math.sqrt(Math.pow(figures[i].x - x, 2) + Math.pow(figures[i].y - y, 2));
          if (dist < figures[i].r) {
              objects.push(figures[i]);
              distForObjects.push(dist);
              index.push(i);
          }
      }
      let indexOfMinDist = distForObjects.indexOf(Math.min.apply(null, distForObjects)),
          figure = objects[indexOfMinDist],
          orginalCoords = data[index[indexOfMinDist]];
      if (figure !== canvas.focusedArc) {
          scatterDraw();
          if (figure) {
              arcDraw(figure.x, figure.y, figure.r, 'rgba(20, 200, 36, 0.3)');
              canvas.setAttribute('title',
                  'x: ' + orginalCoords.x +
                  '\ny: ' + orginalCoords.y +
                  '\nr: ' + orginalCoords.r);
          }
          canvas.focusedArc = figure;
      }
  }

  function scatterDraw() {
      canvas.removeAttribute('title');
      let figures = canvas.figureLocation,
          scale = canvas.scale,
          limits = canvas.limits;
      ctx.clearRect(margin.left, 0, canvas.width - margin.left - margin.right, canvas.height - margin.bottom + 4);

      zeroAxisDraw(limits, scale);
      figures.forEach(function (item) {
          arcDraw(item.x, item.y, item.r, 'rgba(20, 200, 36, 0.4)');
      });
  }


  // line chart
  function lineChartMinAndMax(obj) {
      let x = Object.keys(obj),
          maxX = parseInt(x[0]),
          minX = parseInt(x[0]),
          maxY = obj[x[0]][0],
          minY = obj[x[0]][0],
          count = 0,
          unique = [];
      for (let i in obj) {
          let index = parseInt(i);
          if (isNaN(index)) continue;
          if (unique.indexOf(index) === -1) unique.push(index);
          if (index > maxX) maxX = index;
          else if (index < minX) minX = index;
          if (obj[i].length > count) count = obj[i].length;
          for (let j = 0; j < obj[i].length; j++) {
              if (!obj[i][j] && obj[i][j] !== 0) continue;
              if (obj[i][j] > maxY) maxY = obj[i][j];
              else if (obj[i][j] < minY) minY = obj[i][j];
          }
      }
      return {maxX: maxX, maxY: maxY, minX: minX, minY: minY, count: count, unique: unique};
  }

  function lineChartDraw() {
        canvas.removeAttribute('title');
        ctx.clearRect(margin.left - 5, margin.top - 5,
            canvas.width - margin.left - margin.right + 10, canvas.height - margin.top - margin.bottom + 10);
        let distanceX = canvas.distanceX,
            scale = canvas.scale,
            chartData = canvas.chartData;

        zeroAxisDraw(chartData, scale);

        for (let line = 0; line < chartData.count; line++) {
            let pathBegin = true,
                lastCoords = null,
                numberPoint = 0,
                color = colors[line % colors.length];

            for (let i in data) {
                let cursor = parseInt(i);
                if (isNaN(cursor) || !data[i][line] && data[i][line] !== 0) {numberPoint++; continue;}
                let coords = {
                    x: margin.left + distanceX * numberPoint,
                    y: canvas.height - margin.bottom - (data[i][line] - chartData.minY) * scale.y
                };
                if (!pathBegin) lineDraw(lastCoords, coords, color);

                arcDraw(coords.x, coords.y, 2, color);

                lastCoords = coords;
                pathBegin = false;
                numberPoint++;
            }
        }
        canvas.currentX = -1;
    }

  function lineChartRedraw(e) {
        let rect = canvas.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
        let valuesX = canvas.valuesX,
            distanceX = canvas.distanceX,
            scaleY = canvas.scale.y,
            chartData = canvas.chartData;
        if (x >= margin.left && x <= canvas.width - margin.right && y <= canvas.height - margin.bottom && y >= margin.top) {
            let index = Math.round((x - margin.left) / distanceX),
                currentX = valuesX[index];
            if ( currentX !== canvas.currentX) {
                canvas.removeAttribute('title');
                lineChartDraw();
                canvas.currentX = currentX;
                let title = 'x: ' + currentX + '\n';
                data[currentX].forEach(function (item, i) {
                    if (!isNaN(item) && item !== null) {
                        arcDraw(margin.left + index * distanceX, canvas.height - margin.bottom - (item - chartData.minY) * scaleY,
                            5, colors[i % colors.length]);
                        title += colors[i % colors.length] + ': ' + item + '\n';
                    }
                });
                canvas.setAttribute('title', title);
            }
        } else if (canvas.currentX !== -1) {
            lineChartDraw();
        }
    }

  function lineChart() {
      canvas.className = 'line chart';
      canvas.figureLocation = [];

      let dataForChart = lineChartMinAndMax(data),
          scale = {
              y: (canvas.height - margin.top - margin.bottom) / (dataForChart.maxY - dataForChart.minY)
          },
          distanceX = Math.floor((canvas.width - margin.left - margin.right) / (dataForChart.unique.length - 1));
      canvas.valuesX = dataForChart.unique;
      canvas.distanceX = distanceX;
      canvas.scale = scale;
      canvas.chartData = dataForChart;

      leftAxisDraw(dataForChart, scale);
      bottomAxisDraw({isUnique: true, uniqueData: dataForChart.unique, distance: distanceX});

      lineChartDraw();

  }


  // stacked bar chart
  function stackedBarCombine(arr) {
      let result = {};
      for (let i = 0; i < arr.length; i++) {
          if (!result[arr[i][0].toString()]) result[arr[i][0].toString()] = [];
          for (let j = 1; j < arr[i].length; j++) {
              result[arr[i][0].toString()].push(arr[i][j]);
          }
      }
      return (result);
  }

  function stackedBarMinAndMax(obj) {
      let maxX = 0,
          count = 0;
      for (let i in obj) {
          if (Array.isArray(obj[i])) {
              count++;
              let sum = 0;
              obj[i].forEach(function (item) { sum += item;})
              if (maxX < sum) maxX = sum;
          }
      }
      return {maxX: maxX + Math.round(maxX / 20), minX: 0, count: count};
  }

  function stackedBarRedraw (e) {
      let rect = canvas.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;
      let figures = canvas.figureLocation,
          color;
      if (x > margin.left && x < canvas.width - margin.right && y > margin.top && y < canvas.height - margin.bottom) {
          let name = figures.names[Math.floor((y - margin.top) / figures.barHeight)],
              bar = -1,
              rightX = 0;
          x -= margin.left;
          for (let i = 0; i < figures.data[name].length; i++) {
              rightX += figures.data[name][i] * figures.scale;
              if (x <= rightX) {
                  bar = i;
                  break;
              }
          }
          if (bar === -1 && canvas.focusedBlock >= 0) {
              canvas.removeAttribute('title');
              color = colorsRGBA[canvas.focusedBlock % colorsRGBA.length] + '0.6)';

              barDraw(canvas.focusedX, canvas.ficusedY, canvas.focusedW, figures.barHeight - 1, color);
              canvas.focusedBar = -1;
              canvas.focusedBlock = -1;
          }
          if (bar !== -1 && (bar !== canvas.focusedBlock || name !== canvas.focusedBar)) {
              if (canvas.focusedBar && canvas.focusedBlock >= 0) {
                  color = colorsRGBA[canvas.focusedBlock % colorsRGBA.length] + '0.6)';
                 barDraw(canvas.focusedX, canvas.ficusedY, canvas.focusedW, figures.barHeight - 1, color);
              }
              canvas.focusedX = margin.left + rightX - figures.data[name][bar] * figures.scale;
              canvas.ficusedY = margin.top + Math.floor((y - margin.top) / figures.barHeight) * figures.barHeight + 1;
              canvas.focusedW = figures.data[name][bar] * figures.scale;
              canvas.focusedBar = name;
              canvas.focusedBlock = bar;
              color = colorsRGBA[bar % colorsRGBA.length] + '1)';
              barDraw( canvas.focusedX, canvas.ficusedY, canvas.focusedW, figures.barHeight - 1, color);
              let sum = 0;
              figures.data[name].forEach(function (item) {
                  sum += item;
              });
              canvas.setAttribute('title', 'name: ' + name +
                  '\nthis block: ' + figures.data[name][bar] +
                  '\ntotal length: ' + sum);
          }
      } else if (canvas.focusedBar && canvas.focusedBlock >= 0) {
          canvas.removeAttribute('title');
          color = colorsRGBA[canvas.focusedBlock % colorsRGBA.length] + '0.6)';
          barDraw(canvas.focusedX, canvas.ficusedY, canvas.focusedW, figures.barHeight - 1, color);
      }
  }

  function stackedBarDraw() {
      if (canvas.focusedBlock !== -1) {
          canvas.removeAttribute('title');
          let color = colorsRGBA[canvas.focusedBlock % colorsRGBA.length] + '0.6)';
          barDraw(canvas.focusedX, canvas.ficusedY, canvas.focusedW, canvas.figureLocation.barHeight - 1, color);
      }
  }

  function stackedBarChart() {
        canvas.className = 'stacked bar chart';
        canvas.figureLocation =  {};
        let combinedData = stackedBarCombine(data),
            maxes = stackedBarMinAndMax(combinedData),
            scale = {
                x: Math.floor((canvas.width - margin.left - margin.right) / maxes.maxX)
            },
            distanceY = Math.floor((canvas.height - margin.top - margin.bottom) / maxes.count),
            lastBarX = margin.left,
            bar = 0,
            color;

        canvas.figureLocation = {
            barHeight: distanceY,
            scale: scale.x,
            data: combinedData,
            names: []
        };
        bottomAxisDraw(maxes, scale);

        for (let i in combinedData) {
            if (Array.isArray(combinedData[i])) {
                canvas.figureLocation.names.push(i);

                lastBarX = margin.left;
                for (let slice = 0; slice < combinedData[i].length; slice++) {
                    color = colorsRGBA[slice % colorsRGBA.length] + '0.6)';
                    barDraw(lastBarX, margin.top + bar * distanceY + 1,
                        scale.x * combinedData[i][slice], distanceY - 1,color);

                    lastBarX += scale.x * combinedData[i][slice];
                }
                ctx.fillStyle = 'black';
                ctx.font = '10px Arial';
                ctx.fillText(i, 5, margin.top + bar * distanceY + 1 + distanceY - 1 / 2);
                bar++;
            }
        }

    }


  function resizeCanvas() {
      canvas.height = canvas.offsetHeight;
      canvas.width = canvas.offsetWidth;
      if (canvas.className === 'histogram') {
          simpleHistogram();
      } else if (canvas.className === 'scatter plot') {
          scatterChart();
      } else if (canvas.className === 'stacked bar chart') {
          stackedBarChart();
      } else if (canvas.className === 'line chart') {
          lineChart();
      }
  }


  let data = this,
      canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      margin = {left: 30, right: 10, top: 10, bottom: 30},
      colors = ['Red', 'Green', 'Blue', 'Navy', 'Maroon', 'Purple', 'Teal', 'Gray', 'Fuchsia', 'Aqua', 'Orange',
          'Black', 'Yellow', 'Lime', 'Olive'],
      colorsRGBA = ['rgba(255, 0, 0, ', 'rgba(0, 128, 0, ', 'rgba(0, 0, 255, ', 'rgba(0, 0, 128, ', 'rgba(128, 0, 0, ',
          'rgba(128, 0, 128,', 'rgba(0, 128, 128, ', 'rgba(128, 128, 128,', 'rgba(255, 0, 255, ', 'rgba(0, 255, 255, ',
          'rgba(255, 165, 0, ', 'rgba(0, 0, 0, ', 'rgba(255, 255, 0, ', 'rgba(0, 255, 0, ', 'rgba(128, 128, 0, '];

  let body = document.getElementsByTagName('body')[0],
      html = document.getElementsByTagName('html')[0];

  html.style.height = '100%';
  body.style.height = '100%';
  body.style.fontSize = 0;
  body.style.margin = 0;

  body.appendChild(canvas);

  switch(document.getElementsByTagName('canvas').length) {
      case 5:
          canvas.style.width = '100%';
          canvas.style.height = '34%';
          break;
      default:
          canvas.style.width = '50%';
          canvas.style.height = '33%';
          break;
  }

  resizeCanvas();

  if (Array.isArray(data)) {
      if (typeof data[0] !== 'object') {
          simpleHistogram();
      } else if (data[0].x && data[0].y && data[0].r) {
          scatterChart();
      } else if (Array.isArray(data)) {
          stackedBarChart();
      }
  } else if (typeof data === 'object') {
      lineChart();
  }

  // Попытка определить тип диаграммы по типу данных крайне наивна, и даст
  // сбой при первой же возможности. Рекомендуется потратить ещё некоторое
  // время на доработку кода, и требовать передачу параметров в метод draw().

    if (canvas.className === 'histogram') {
        canvas.onmousemove = histogramBarRedraw;
        canvas.onmouseleave = histogramDraw;
    } else if (canvas.className === 'scatter plot') {
        canvas.onmousemove = scatterRedraw;
        canvas.onmouseleave = scatterDraw;
    } else if (canvas.className === 'stacked bar chart') {
        canvas.onmousemove = stackedBarRedraw;
        canvas.onmouseleave = stackedBarDraw;
    } else if (canvas.className === 'line chart') {
        canvas.onmousemove = lineChartRedraw;
        canvas.onmouseleave = lineChartDraw;
    }

  window.addEventListener('resize', resizeCanvas);

  return {data: data, canvas:canvas};
};