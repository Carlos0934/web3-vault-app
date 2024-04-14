class SuccessLoginResult {
  final String token;

  SuccessLoginResult({required this.token});

  factory SuccessLoginResult.fromJson(Map<String, dynamic> json) {
    return SuccessLoginResult(
      token: json['token'],
    );
  }
}
