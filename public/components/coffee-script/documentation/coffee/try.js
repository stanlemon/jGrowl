(function() {
  var error;

  try {
    allHellBreaksLoose();
    catsAndDogsLivingTogether();
  } catch (_error) {
    error = _error;
    print(error);
  } finally {
    cleanUp();
  }

}).call(this);
