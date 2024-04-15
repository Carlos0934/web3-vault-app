import 'package:app/dtos/file_metadata.dart';
import 'package:app/services/file_service.dart';
import 'package:app/utils/bytes_formatter_extension.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class MyFilesView extends StatefulWidget {
  final Future<List<FileMetadata>> filesMetadata;
  final VoidCallback onRefresh;

  const MyFilesView({
    super.key,
    required this.filesMetadata,
    required this.onRefresh,
  });

  @override
  State<MyFilesView> createState() => _MyFilesViewState();
}

class _MyFilesViewState extends State<MyFilesView> {
  final FileService _fileService = FileService();
  final DateFormat _dateFormat = DateFormat('yyyy-MM-dd');

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: widget.filesMetadata,
      builder: (context, AsyncSnapshot<List<FileMetadata>> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        }
        if (snapshot.data!.isEmpty) {
          return const Center(child: Text('No hay archivos disponibles'));
        }
        return ListView.builder(
          itemCount: snapshot.data!.length,
          itemBuilder: (context, index) {
            final file = snapshot.data![index];
            return ListTile(
              title: Text(file.name),
              leading: const Icon(Icons.file_copy),
              subtitle: Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Size:${file.size.toHumanReadableFileSize()}'),
                    Text(_dateFormat.format(
                      DateTime.fromMillisecondsSinceEpoch(
                          file.createdAt * 1000),
                    ))
                  ]),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    icon: Icon(Icons.download,
                        color: Theme.of(context).primaryColor),
                    onPressed: () async {
                      try {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Descargando archivo...'),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                        await _fileService.downloadFile(file);
                        ScaffoldMessenger.of(context).hideCurrentSnackBar();
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                              content: Text('Archivo descargado con éxito'),
                              behavior: SnackBarBehavior.floating,
                              backgroundColor: Colors.green,
                              animation: AnimationController(
                                vsync: Scaffold.of(context),
                                duration: const Duration(milliseconds: 1500),
                              )),
                        );
                      } catch (e) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(e.toString()),
                            behavior: SnackBarBehavior.floating,
                            backgroundColor: Colors.red,
                          ),
                        );
                      }
                    },
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete, color: Colors.red),
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (dialogContext) {
                          return AlertDialog(
                            title: const Text('Eliminar archivo'),
                            content: const Text(
                                '¿Estás seguro que deseas eliminar este archivo?'),
                            actions: [
                              TextButton(
                                onPressed: () {
                                  Navigator.of(dialogContext).pop();
                                },
                                child: const Text('Cancelar'),
                              ),
                              TextButton(
                                onPressed: () async {
                                  try {
                                    Navigator.of(dialogContext).pop();
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('Eliminando archivo...'),
                                        behavior: SnackBarBehavior.floating,
                                      ),
                                    );
                                    print('Deleting file ${file.key}');
                                    await _fileService.deleteFile(file.key);
                                    ScaffoldMessenger.of(context)
                                        .hideCurrentSnackBar();
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content:
                                            Text('Archivo eliminado con éxito'),
                                        behavior: SnackBarBehavior.floating,
                                        backgroundColor: Colors.green,
                                        animation: AnimationController(
                                          vsync: Scaffold.of(context),
                                          duration: const Duration(
                                              milliseconds: 1500),
                                        ),
                                      ),
                                    );

                                    widget.onRefresh();
                                  } catch (e) {
                                    print(e);
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text(e.toString()),
                                        backgroundColor: Colors.red,
                                        behavior: SnackBarBehavior.floating,
                                      ),
                                    );
                                  }
                                },
                                child: const Text('Eliminar'),
                              ),
                            ],
                          );
                        },
                      );
                    },
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}
