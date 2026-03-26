[Setup]
; --- Application Info ---
AppName=Nexo
AppVersion=1.0
AppPublisher=Luca Cisternino
AppCopyright=Copyright (c) 2026 Luca Cisternino
DefaultDirName={autopf}\Nexo
DefaultGroupName=Nexo
AllowNoIcons=yes

; --- Visuals & Icons ---
SetupIconFile=C:\Users\ciste\RiderProjects\Nexo\NexoCompiler\Installer\res\NPL.ico
UninstallDisplayIcon={app}\NPL.ico

; --- Output Settings ---
OutputDir=C:\Users\ciste\RiderProjects\Nexo\NexoCompiler\Installer\Output
OutputBaseFilename=NexoSetup
Compression=lzma
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64

[Dirs]
Name: "C:\Programs\Nexo\libs"; Permissions: users-full

[Files]
; The main compiler executable globally routed
Source: "C:\Users\ciste\RiderProjects\Nexo\PublishedExe\Nexo.exe"; DestDir: "{app}"; DestName: "nexo.exe"; Flags: ignoreversion
; The official icon for file association
Source: "C:\Users\ciste\RiderProjects\Nexo\NexoCompiler\Installer\res\NPL.ico"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
; Start Menu Shortcut
Name: "{group}\Nexo"; Filename: "{app}\Nexo.exe"; IconFilename: "{app}\NPL.ico"

[Registry]
; --- FILE ASSOCIATION (.nexo) ---
; Register the .nexo extension
Root: HKCR; Subkey: ".nexo"; ValueType: string; ValueName: ""; ValueData: "NexoScript"; Flags: uninsdeletevalue

; Define the "NexoScript" file type
Root: HKCR; Subkey: "NexoScript"; ValueType: string; ValueName: ""; ValueData: "Nexo Script File"; Flags: uninsdeletekey

; Set the default icon for .nexo files
Root: HKCR; Subkey: "NexoScript\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\NPL.ico"

; Set the shell "Open" command (Right-click or Double-click)
Root: HKCR; Subkey: "NexoScript\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\nexo.exe"" open ""%1"""

; Inject PATH globally for NPM tracking
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}"; Check: NeedsAddPath(ExpandConstant('{app}'))

[Code]
function NeedsAddPath(Param: string): boolean;
var
  OrigPath: string;
begin
  if not RegQueryStringValue(HKEY_LOCAL_MACHINE, 'SYSTEM\CurrentControlSet\Control\Session Manager\Environment', 'Path', OrigPath) then
  begin
    Result := True;
    exit;
  end;
  Result := Pos(';' + Param + ';', ';' + OrigPath + ';') = 0;
end;