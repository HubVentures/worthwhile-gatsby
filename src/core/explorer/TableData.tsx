import { isolate } from 'mishmash';
import * as d3 from 'd3-selection';

import { colors } from '../styles';

export default isolate((elem, { dataRows }) => {
  elem.style.borderTop = '1px solid #ccc';

  const rows = d3
    .select(elem)
    .selectAll('tr')
    .data([...dataRows]);

  rows.exit().remove();

  const cells = rows
    .enter()
    .append('tr')

    .merge(rows)
    .selectAll('td')
    .data(d => d);

  cells.exit().remove();

  cells
    .enter()
    .append('td')
    .style('position', 'relative')
    .style('padding', '7px 10px')
    .style('border-style', 'solid')
    .style('border-color', '#ccc')
    .style('vertical-align', 'top')
    .style('max-width', '400px')
    .style('font-family', 'Ubuntu, sans-serif')
    .style('font-size', '12px')
    .style('line-height', '18px')
    .style('color', colors.black)
    .style('white-space', 'pre')

    .merge(cells)
    .style('border-top-width', d => (!d.first ? '1px' : null))
    .style(
      'border-left-width',
      d => (!d.firstCol && (d.field === '#1' ? '2px' : '1px')) || null,
    )
    .style(
      'border-right-width',
      d => (!d.lastCol && d.field === '#2' && '1px') || null,
    )
    .style('background', d => (d.empty ? '#fafafa' : 'white'))
    .style(
      'color',
      d => (d.field.startsWith('#') || d.value === '-' ? '#ccc' : null),
    )
    .attr('rowspan', d => d.span)
    .text(d => d.value)

    .filter(d => d.value && !d.field.startsWith('#'))
    .style('cursor', 'pointer')
    .on('mouseenter', function() {
      this.style.background = '#eee';
    })
    .on('mouseleave', function() {
      this.style.background = null;
    })
    .attr('data-key', d => `${d.type}.${d.id}.${d.field}`);
}, 'tbody');
