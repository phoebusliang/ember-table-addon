// FIXME(azirbel): Why change back to ..? We want to import from the component.
// I want to change this back to 'ember-table/views/table-cell'
import TableCell from '../views/table-cell';

export default TableCell.extend({
  templateName: 'ajax-table/ajax-cell',
  classNames: 'img-table-cell'
});
