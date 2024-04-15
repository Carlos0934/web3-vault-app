extension PhoneNumberExtensions on String {
  /// method returns a human readable string representing a phone number
  String toHumanReadablePhoneNumber() {
    return replaceAllMapped(RegExp(r'^(\d{3})(\d{3})(\d{4})$'),
        (Match m) => '(${m[1]}) ${m[2]}-${m[3]}');
  }
}
