import Ember from 'ember';

export default Ember.Component.extend({
  expectedText: Ember.computed('assertion.expected', function(){
    return escapeText(window.QUnit.dump.parse( this.get('assertion.expected') ));
  }),
  actualText: Ember.computed('assertion.actual', function(){
    return escapeText(window.QUnit.dump.parse( this.get('assertion.actual') ));
  }),
  diffText: Ember.computed('expectedText', 'actualText', function(){
    return window.QUnit.diff(this.get('expectedText'), this.get('actualText'));
  }),
  shouldShowDiff: Ember.computed('diffText', 'actualText', 'expectedText', function(){
    let diff = this.get('diffText');
    let actual = this.get('actualText');
    let expected = this.get('expectedText');
    return stripHtml( diff ).length !== stripHtml( expected ).length + stripHtml( actual ).length;
  })
});

function stripHtml( string ) {
  return string.replace(/<\/?[^>]+(>|$)/g, "").replace(/\&quot;/g, "").replace(/\s+/g, "");
}

function escapeText( s ) {
  if ( !s ) {
    return "";
  }
  s = s + "";

  // Both single quotes and double quotes (for attributes)
  return s.replace( /['"<>&]/g, function( s ) {
    switch ( s ) {
      case "'":
        return "&#039;";
      case "\"":
        return "&quot;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
    }
  });
}
