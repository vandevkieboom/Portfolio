issue met ProtectedRoute:

Wanneer je inlogt als admin en op de knop "Ga naar Admin" klikt:

- Het inlogproces slaat gebruikersgegevens op in de cache van React Query via useGetCurrentUser.
- De gebruikersgegevens zijn direct beschikbaar wanneer je naar de adminpagina navigeert.
- De ProtectedRoute-component kan onmiddellijk je adminstatus verifiëren.

Wanneer je handmatig naar /admin navigeert:

- De pagina voert een nieuwe aanvraag uit om gegevens te laden.
- React Query moet de gebruikersgegevens opnieuw ophalen met getCurrentUser.
- Tijdens dit eerste laden is user nog niet gedefinieerd terwijl het verzoek wordt uitgevoerd.
- De ProtectedRoute-component ziet !user en leidt je door naar /unauthorized voordat de gegevens binnenkomen.
