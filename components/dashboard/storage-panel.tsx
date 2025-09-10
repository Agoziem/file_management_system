import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { storageData } from "./dummy-data";
import { ChartRadialShape } from "./storage-chart";

export const StoragePanelContent = () => (
    <>
      {/* Storage usage */}
      <Card className="mb-6 ">
        <CardHeader>
          <CardTitle className="text-lg font-century-gothic">Storage usage</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartRadialShape totalStorage={10} usedStorage={2.5} />

          <div className="space-y-4 mt-2">
            {storageData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-secondary flex h-8 w-8 items-center justify-center rounded-lg">
                  <item.icon className="text-secondary-foreground h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{item.type}</span>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {item.files} Files | {item.size}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );