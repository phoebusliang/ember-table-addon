// TODO(azirbel): We changed this back to '../views' - why? We want to import
// from the component. This should be 'ember-table/views/table-cell'.
import TableCell from '../views/table-cell';

export default TableCell.extend({
  templateName: 'ajax-table/ajax-cell',
  classNames: 'img-table-cell'
});
