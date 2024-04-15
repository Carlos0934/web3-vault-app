class UserProfile {
  final String id;
  final String fullName;
  final String email;
  final String phone;

  UserProfile(
      {required this.id,
      required this.email,
      required this.phone,
      required this.fullName});

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'],
      fullName: json['fullName'],
      email: json['email'],
      phone: json['phone'],
    );
  }
}
