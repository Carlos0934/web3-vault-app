extension FileSizeExtensions on num {
  /// method returns a human readable string representing a file size
  /// size can be passed as number or as string
  /// the optional parameter 'round' specifies the number of numbers after comma/point (default is 2)
  /// the optional boolean parameter 'useBase1024' specifies if we should count in 1024's (true) or 1000's (false). e.g. 1KB = 1024B (default is true)
  String toHumanReadableFileSize({int round = 2, bool useBase1024 = true}) {
    const List<String> affixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

    num divider = useBase1024 ? 1024 : 1000;

    num size = this;
    num runningDivider = divider;
    num runningPreviousDivider = 0;
    int affix = 0;

    while (size >= runningDivider && affix < affixes.length - 1) {
      runningPreviousDivider = runningDivider;
      runningDivider *= divider;
      affix++;
    }

    String result =
        (runningPreviousDivider == 0 ? size : size / runningPreviousDivider)
            .toStringAsFixed(round);

    //Check if the result ends with .00000 (depending on how many decimals) and remove it if found.
    if (result.endsWith("0" * round))
      result = result.substring(0, result.length - round - 1);

    return "$result ${affixes[affix]}";
  }
}

extension PhoneNumberExtensions on String {
  /// method returns a human readable string representing a phone number
  String toHumanReadablePhoneNumber() {
    return replaceAllMapped(RegExp(r'^(\d{3})(\d{3})(\d{4})$'),
        (Match m) => '(${m[1]}) ${m[2]}-${m[3]}');
  }
}
