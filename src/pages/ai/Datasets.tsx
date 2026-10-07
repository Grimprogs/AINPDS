import React from 'react';
import { mockDatasets } from '../../data/mockData';
import { Database, FileText, Download, ExternalLink, CheckCircle } from 'lucide-react';

export const Datasets: React.FC = () => {
  const officialLinks: Record<string, { officialUrl: string; mirrorUrl: string }> = {
    'DS-CIC2017': {
      officialUrl: 'https://www.unb.ca/cic/datasets/ids-2017.html',
      mirrorUrl: 'https://www.kaggle.com/datasets/cicdataset/cicids2017'
    },
    'DS-NSLKDD': {
      officialUrl: 'https://www.unb.ca/cic/datasets/nsl.html',
      mirrorUrl: 'https://www.kaggle.com/datasets/h3293883/nslkdd'
    },
    'DS-UNSW15': {
      officialUrl: 'https://research.unsw.edu.au/projects/unsw-nb15-dataset',
      mirrorUrl: 'https://www.kaggle.com/datasets/mrwell/unsw-nb15'
    }
  };

  const generateAndDownloadCsv = (datasetId: string, datasetName: string) => {
    let headers: string[] = [];
    let sampleRows: string[][] = [];

    if (datasetId === 'DS-NSLKDD') {
      headers = ['duration', 'protocol_type', 'service', 'flag', 'src_bytes', 'dst_bytes', 'land', 'wrong_fragment', 'urgent', 'hot', 'num_failed_logins', 'logged_in', 'count', 'srv_count', 'same_srv_rate', 'diff_srv_rate', 'label'];
      sampleRows = [
        ['0', 'tcp', 'http', 'SF', '215', '45076', '0', '0', '0', '0', '0', '1', '1', '1', '1.00', '0.00', 'normal'],
        ['0', 'tcp', 'private', 'REJ', '0', '0', '0', '0', '0', '0', '0', '0', '123', '6', '0.05', '0.07', 'neptune_ddos'],
        ['0', 'udp', 'domain_u', 'SF', '44', '134', '0', '0', '0', '0', '0', '0', '1', '1', '1.00', '0.00', 'normal'],
        ['0', 'tcp', 'smtp', 'SF', '1590', '389', '0', '0', '0', '0', '0', '1', '1', '1', '1.00', '0.00', 'normal'],
        ['0', 'tcp', 'http', 'S0', '0', '0', '0', '0', '0', '0', '0', '0', '250', '12', '0.04', '0.06', 'syn_flood_dos'],
        ['0', 'tcp', 'ftp_data', 'SF', '334', '0', '0', '0', '0', '0', '0', '1', '2', '2', '1.00', '0.00', 'warezmaster_exploit'],
        ['0', 'icmp', 'eco_i', 'SF', '18', '0', '0', '0', '0', '0', '0', '0', '1', '1', '1.00', '0.00', 'ipsweep_scan'],
        ['0', 'tcp', 'ssh', 'SF', '0', '0', '0', '0', '0', '0', '5', '0', '150', '150', '1.00', '0.00', 'brute_force_ssh']
      ];
    } else if (datasetId === 'DS-CIC2017') {
      headers = ['Destination_Port', 'Flow_Duration', 'Total_Fwd_Packets', 'Total_Backward_Packets', 'Total_Length_of_Fwd_Packets', 'Flow_Bytes_s', 'Flow_Packets_s', 'Fwd_Packet_Length_Max', 'Bwd_Packet_Length_Max', 'SYN_Flag_Count', 'ACK_Flag_Count', 'Label'];
      sampleRows = [
        ['80', '108420', '3', '4', '180', '4802.1', '64.5', '60', '1460', '0', '1', 'BENIGN'],
        ['80', '1205', '124', '0', '7440', '6174273.8', '102904.5', '60', '0', '124', '0', 'DDoS_SYN_FLOOD'],
        ['443', '5401', '8', '7', '450', '21052.1', '2777.2', '200', '512', '0', '1', 'BENIGN'],
        ['80', '221', '2', '0', '512', '2316742.0', '9049.7', '256', '0', '0', '0', 'SQL_INJECTION_PROBE'],
        ['22', '350021', '15', '12', '900', '4200.5', '77.1', '60', '60', '0', '1', 'SSH_BRUTE_FORCE']
      ];
    } else {
      headers = ['dur', 'proto', 'service', 'state', 'spkts', 'dpkts', 'sbytes', 'dbytes', 'rate', 'sttl', 'dttl', 'sload', 'dload', 'attack_cat', 'label'];
      sampleRows = [
        ['0.000011', 'udp', 'dns', 'INT', '2', '0', '114', '0', '90909.09', '254', '0', '41454545', '0', 'Normal', '0'],
        ['0.000008', 'tcp', 'http', 'FIN', '10', '8', '800', '12000', '225000.0', '62', '252', '8000000', '120000000', 'Generic', '1'],
        ['0.000005', 'tcp', 'ftp', 'CON', '50', '0', '2500', '0', '10000000', '254', '0', '400000000', '0', 'Exploits', '1'],
        ['0.000002', 'icmp', 'dns', 'INT', '2', '0', '114', '0', '500000.0', '254', '0', '228000000', '0', 'Reconnaissance', '1']
      ];
    }

    const csvContent = [
      headers.join(','),
      ...sampleRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${datasetId.toLowerCase()}_sample_processed.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131316] border border-white/10 p-5 rounded-xl shadow-lg">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Database className="w-5 h-5" />
            </div>
            <h1 className="text-base font-bold text-white uppercase tracking-wider">
              Training Dataset Repository & Download Hub
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Benchmark network packet capture datasets (CICIDS2017, NSL-KDD, UNSW-NB15) with sample CSV exports & direct repository download links.
          </p>
        </div>
      </div>

      {/* Datasets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockDatasets.map(ds => {
          const links = officialLinks[ds.id];
          return (
            <div key={ds.id} className="bg-[#131316] border border-white/10 rounded-xl p-5 space-y-4 flex flex-col justify-between shadow-md hover:border-white/20 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs text-orange-400 font-bold tracking-wider">{ds.id}</span>
                  <span className="text-[10px] text-slate-400 font-mono bg-white/5 px-2 py-0.5 rounded">{ds.fileSize}</span>
                </div>

                <h3 className="text-sm font-bold text-white">{ds.name}</h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">{ds.description}</p>

                <div className="bg-[#0A0A0B] p-3 rounded-lg border border-white/5 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Total Samples:</span>
                    <span className="text-slate-100 font-bold">{ds.recordsCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Features Extracted:</span>
                    <span className="text-slate-200">{ds.featuresCount} columns</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Attack / Normal Split:</span>
                    <span className="text-emerald-400 font-bold">{(ds.normalCount / ds.recordsCount * 100).toFixed(0)}% / {(ds.maliciousCount / ds.recordsCount * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => generateAndDownloadCsv(ds.id, ds.name)}
                  className="w-full flex items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/40 py-2 rounded-md text-xs font-bold transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-orange-400" />
                  <span>Download Sample CSV ({ds.featuresCount} Cols)</span>
                </button>

                {links && (
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <a
                      href={links.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-300 py-1.5 px-2 rounded-md transition-all border border-white/5 text-center"
                    >
                      <span>UNB Official</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                    <a
                      href={links.mirrorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-300 py-1.5 px-2 rounded-md transition-all border border-white/5 text-center"
                    >
                      <span>Kaggle Mirror</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

